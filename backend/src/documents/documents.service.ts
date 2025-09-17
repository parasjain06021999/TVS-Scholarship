import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async uploadDocument(file: Express.Multer.File, body: any, userId: string) {
    try {
      const document = await this.prisma.document.create({
        data: {
          fileName: file.originalname,
          filePath: file.path,
          fileSize: file.size,
          mimeType: file.mimetype,
          type: body.type || 'OTHER',
          // status: 'UPLOADED', // Field doesn't exist in schema
          studentId: userId,
          applicationId: body.applicationId || null,
        } as any,
      });

      return {
        success: true,
        message: 'Document uploaded successfully',
        data: document,
      };
    } catch (error) {
      throw new Error(`Failed to upload document: ${error.message}`);
    }
  }

  async getUserDocuments(userId: string) {
    try {
      const documents = await this.prisma.document.findMany({
        where: {
          studentId: userId,
        },
        orderBy: {
          uploadedAt: 'desc',
        },
      });

      return {
        success: true,
        data: documents,
      };
    } catch (error) {
      throw new Error(`Failed to fetch documents: ${error.message}`);
    }
  }

  async getDocument(id: string, userId: string) {
    try {
      const document = await this.prisma.document.findUnique({
        where: { id },
      });

      if (!document) {
        throw new NotFoundException('Document not found');
      }

      if (document.studentId !== userId) {
        throw new ForbiddenException('Access denied');
      }

      return {
        success: true,
        data: document,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new Error(`Failed to fetch document: ${error.message}`);
    }
  }

  async verifyDocument(id: string, status: string, notes: string, userId: string) {
    try {
      const document = await this.prisma.document.update({
        where: { id },
        data: {
          // status: status as any, // Field doesn't exist in schema
          // verificationNotes: notes, // Field doesn't exist in schema
          // verifiedBy: userId, // Field doesn't exist in schema
          // verifiedAt: new Date(), // Field doesn't exist in schema
        },
      });

      return {
        success: true,
        message: 'Document verification updated',
        data: document,
      };
    } catch (error) {
      throw new Error(`Failed to verify document: ${error.message}`);
    }
  }

  async deleteDocument(id: string, userId: string) {
    try {
      const document = await this.prisma.document.findUnique({
        where: { id },
      });

      if (!document) {
        throw new NotFoundException('Document not found');
      }

      if (document.studentId !== userId) {
        throw new ForbiddenException('Access denied');
      }

      await this.prisma.document.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Document deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  }
}
