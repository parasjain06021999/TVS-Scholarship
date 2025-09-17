import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentMetadata } from '../mongodb/schemas/document-metadata.schema';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    @InjectModel('DocumentMetadata') private documentMetadataModel: Model<DocumentMetadata>,
  ) {}

  async uploadDocument(data: {
    file: Express.Multer.File;
    type: string;
    studentId: string;
    applicationId?: string;
  }) {
    const { file, type, studentId, applicationId } = data;

    // Validate file
    this.validateFile(file);

    // Generate unique filename
    const fileExtension = path.extname(file.originalname);
    const fileName = `${crypto.randomUUID()}${fileExtension}`;
    const filePath = path.join('uploads', 'documents', fileName);

    // Ensure upload directory exists
    const uploadDir = path.dirname(filePath);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save file to disk
    fs.writeFileSync(filePath, file.buffer);

    // Calculate file hash
    const fileHash = crypto.createHash('sha256').update(file.buffer).digest('hex');

    // Create document record in PostgreSQL
    const document = await this.prisma.document.create({
      data: {
        studentId,
        applicationId,
        type: type as any,
        fileName,
        originalName: file.originalname,
        filePath,
        fileSize: file.size,
        mimeType: file.mimetype,
        isVerified: false,
      },
    });

    // Create metadata record in MongoDB
    const metadata = new this.documentMetadataModel({
      documentId: document.id,
      studentId,
      applicationId,
      type,
      fileName,
      originalName: file.originalname,
      filePath,
      fileSize: file.size,
      mimeType: file.mimetype,
      fileHash,
      status: 'uploaded',
      uploadedBy: studentId,
      uploadedAt: new Date(),
    });

    await metadata.save();

    // Perform virus scan (mock)
    await this.performVirusScan(document.id);

    return {
      id: document.id,
      fileName,
      originalName: file.originalname,
      filePath,
      fileSize: file.size,
      mimeType: file.mimetype,
      status: 'uploaded',
      uploadedAt: document.uploadedAt,
    };
  }

  async findAll(filters: {
    page: number;
    limit: number;
    studentId?: string;
    type?: string;
    status?: string;
  }) {
    const { page, limit, studentId, type, status } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (studentId) where.studentId = studentId;
    if (type) where.type = type;
    if (status) where.isVerified = status === 'verified';

    const [documents, total] = await Promise.all([
      this.prisma.document.findMany({
        where,
        skip,
        take: limit,
        orderBy: { uploadedAt: 'desc' },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.document.count({ where }),
    ]);

    return {
      documents: documents.map(doc => ({
        id: doc.id,
        type: doc.type,
        fileName: doc.fileName,
        originalName: doc.originalName,
        fileSize: doc.fileSize,
        mimeType: doc.mimeType,
        isVerified: doc.isVerified,
        uploadedAt: doc.uploadedAt,
        student: doc.student,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        application: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (!document) {
      return null;
    }

    // Get metadata from MongoDB
    const metadata = await this.documentMetadataModel.findOne({ documentId: id });

    return {
      ...document,
      metadata: metadata ? {
        fileHash: metadata.fileHash,
        virusScanResult: metadata.virusScanResult,
        virusScanDate: metadata.virusScanDate,
        verificationNotes: metadata.verificationNotes,
        rejectionReason: metadata.rejectionReason,
      } : null,
    };
  }

  async verifyDocument(id: string, status: string, verificationNotes?: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return null;
    }

    const isVerified = status === 'verified';
    const verifiedAt = isVerified ? new Date() : null;

    // Update PostgreSQL record
    const updatedDocument = await this.prisma.document.update({
      where: { id },
      data: {
        isVerified,
        verifiedAt,
        verifiedBy: 'current-user-id', // In real app, get from JWT
        rejectionReason: status === 'rejected' ? verificationNotes : null,
      },
    });

    // Update MongoDB metadata
    await this.documentMetadataModel.findOneAndUpdate(
      { documentId: id },
      {
        status: status === 'verified' ? 'verified' : 'rejected',
        verifiedAt,
        verificationNotes,
        rejectionReason: status === 'rejected' ? verificationNotes : null,
      },
    );

    return updatedDocument;
  }

  async remove(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return null;
    }

    // Delete file from disk
    try {
      if (fs.existsSync(document.filePath)) {
        fs.unlinkSync(document.filePath);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }

    // Delete from MongoDB
    await this.documentMetadataModel.deleteOne({ documentId: id });

    // Delete from PostgreSQL
    await this.prisma.document.delete({
      where: { id },
    });

    return { success: true };
  }

  async getStats() {
    const [
      total,
      verified,
      pending,
      rejected,
      byType,
    ] = await Promise.all([
      this.prisma.document.count(),
      this.prisma.document.count({ where: { isVerified: true } }),
      this.prisma.document.count({ where: { isVerified: false } }),
      this.prisma.document.count({ where: { rejectionReason: { not: null } } }),
      this.prisma.document.groupBy({
        by: ['type'],
        _count: { type: true },
      }),
    ]);

    return {
      total,
      verified,
      pending,
      rejected,
      verificationRate: total > 0 ? (verified / total) * 100 : 0,
      byType: byType.reduce((acc, item) => {
        acc[item.type] = item._count.type;
        return acc;
      }, {}),
    };
  }

  private validateFile(file: Express.Multer.File) {
    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 5MB limit');
    }

    // Check file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('File type not allowed. Allowed types: JPG, PNG, PDF, DOC, DOCX');
    }

    // Check file extension
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException('File extension not allowed');
    }
  }

  private async performVirusScan(documentId: string) {
    // Mock virus scan - in production, integrate with actual virus scanning service
    const scanResult = Math.random() > 0.1 ? 'clean' : 'infected'; // 90% clean rate for demo
    
    await this.documentMetadataModel.findOneAndUpdate(
      { documentId },
      {
        virusScanResult: scanResult,
        virusScanDate: new Date(),
      },
    );

    if (scanResult === 'infected') {
      // Mark document as rejected if infected
      await this.prisma.document.update({
        where: { id: documentId },
        data: {
          isVerified: false,
          rejectionReason: 'Virus detected in file',
        },
      });
    }
  }
}
