import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ReviewApplicationDto } from './dto/review-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async create(createApplicationDto: CreateApplicationDto, userId: string) {
    try {
      console.log('Creating application with data:', createApplicationDto);
      console.log('User ID:', userId);
      
      // Check if user has a student record
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { student: true }
      });
      
      console.log('User found:', user);
      
      let studentId = userId;
      
      // If user doesn't have a student record, create one
      if (!user.student) {
        console.log('User does not have student record, creating one...');
        
        // Create student record from personal info
        const personalInfo = createApplicationDto.personalInfo;
        if (!personalInfo) {
          throw new Error('Personal information is required to create student record');
        }
        
        const student = await this.prisma.student.create({
          data: {
            userId: userId,
            firstName: personalInfo.firstName,
            lastName: personalInfo.lastName,
            email: personalInfo.email,
            phone: personalInfo.phone,
            dateOfBirth: new Date(personalInfo.dateOfBirth),
            gender: personalInfo.gender as any,
            address: createApplicationDto.addressInfo?.currentAddress || '',
            city: createApplicationDto.addressInfo?.currentCity || '',
            state: createApplicationDto.addressInfo?.currentState || '',
            pincode: createApplicationDto.addressInfo?.currentPinCode || '',
            aadharNumber: personalInfo.aadharNumber,
            panNumber: personalInfo.panNumber,
            fatherName: createApplicationDto.familyInfo?.fatherName || '',
            fatherOccupation: createApplicationDto.familyInfo?.fatherOccupation || '',
            motherName: createApplicationDto.familyInfo?.motherName || '',
            motherOccupation: createApplicationDto.familyInfo?.motherOccupation || '',
            familyIncome: createApplicationDto.familyInfo?.familyIncome || 0,
            emergencyContact: createApplicationDto.familyInfo?.emergencyContact || '',
          }
        });
        
        studentId = student.id;
        console.log('Student record created:', student.id);
      } else {
        studentId = user.student.id;
        console.log('Using existing student record:', studentId);
      }
      
      // Generate application ID
      const applicationId = `APP-${Date.now()}`;
      
      // Prepare application data according to schema
      const applicationData = {
        personalInfo: createApplicationDto.personalInfo,
        addressInfo: createApplicationDto.addressInfo,
        documents: createApplicationDto.documents,
      };
      
      console.log('Application data to be stored:', applicationData);
      console.log('Using studentId:', studentId);
      
      // Check if application already exists for this student and scholarship
      const existingApplication = await this.prisma.application.findFirst({
        where: {
          studentId: studentId,
          scholarshipId: createApplicationDto.scholarshipId,
        },
      });
      
      if (existingApplication) {
        throw new Error(`Application already exists for this scholarship. Application ID: ${existingApplication.id}`);
      }
      
      const result = await this.prisma.application.create({
        data: {
          id: applicationId,
          scholarshipId: createApplicationDto.scholarshipId,
          studentId: studentId, // Use the student ID, not user ID
          status: 'SUBMITTED',
          applicationData: applicationData,
          academicInfo: createApplicationDto.academicInfo,
          familyInfo: createApplicationDto.familyInfo,
          financialInfo: createApplicationDto.financialInfo,
          additionalInfo: createApplicationDto.additionalInfo,
          submittedAt: new Date(),
        },
        include: {
          student: true,
          scholarship: true,
          documents: true,
          payments: true,
        },
      });
      
      console.log('Application created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  }

  async findAll(filters?: any) {
    const { page = 1, limit = 10, status, scholarshipId } = filters || {};
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    
    const where: any = {};
    if (status) where.status = status;
    if (scholarshipId) where.scholarshipId = scholarshipId;
    
    const applications = await this.prisma.application.findMany({
      where,
      skip,
      take: limitNum,
      include: {
        student: true,
        scholarship: true,
        documents: {
          select: {
            id: true,
            type: true,
            fileName: true,
            originalName: true,
            filePath: true,
            fileSize: true,
            mimeType: true,
            isVerified: true,
            verifiedBy: true,
            verifiedAt: true,
            rejectionReason: true,
            uploadedAt: true,
          }
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log('All applications found:', applications.length);
    console.log('Sample application with documents:', applications[0] ? {
      id: applications[0].id,
      documentsCount: applications[0].documents?.length || 0,
      documents: applications[0].documents
    } : 'No applications found');

    const total = await this.prisma.application.count({ where });

    return {
      applications,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  async findByStudent(userId: string, filters?: any) {
    const { page = 1, limit = 10, status } = filters || {};
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    
    console.log('Finding applications for user ID:', userId);
    
    // First find the student record for this user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { student: true }
    });
    
    console.log('User found:', user);
    
    if (!user || !user.student) {
      console.log('No student record found for user:', userId);
      return {
        applications: [],
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: 0,
          totalPages: 0,
        },
      };
    }
    
    const studentId = user.student.id;
    console.log('Student ID found:', studentId);
    
    const where: any = { studentId };
    if (status) where.status = status;
    
    console.log('Query where condition:', where);
    
    const applications = await this.prisma.application.findMany({
      where,
      skip,
      take: limitNum,
      include: {
        student: true,
        scholarship: true,
        documents: {
          select: {
            id: true,
            type: true,
            fileName: true,
            originalName: true,
            filePath: true,
            fileSize: true,
            mimeType: true,
            isVerified: true,
            verifiedBy: true,
            verifiedAt: true,
            rejectionReason: true,
            uploadedAt: true,
          }
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Alternative approach: Manually fetch documents for each application
    for (let i = 0; i < applications.length; i++) {
      const app = applications[i];
      if (!app.documents || app.documents.length === 0) {
        // Fetch documents for this student
        const studentDocuments = await this.prisma.document.findMany({
          where: { 
            studentId: app.studentId,
            OR: [
              { applicationId: app.id },
              { applicationId: null }
            ]
          },
          select: {
            id: true,
            type: true,
            fileName: true,
            originalName: true,
            filePath: true,
            fileSize: true,
            mimeType: true,
            isVerified: true,
            verifiedBy: true,
            verifiedAt: true,
            rejectionReason: true,
            uploadedAt: true,
          }
        });
        applications[i].documents = studentDocuments;
        console.log(`Manually fetched ${studentDocuments.length} documents for application ${app.id}`);
        
        // If still no documents, try to fetch any documents for this student
        if (studentDocuments.length === 0) {
          const anyStudentDocuments = await this.prisma.document.findMany({
            where: { studentId: app.studentId },
            select: {
              id: true,
              type: true,
              fileName: true,
              originalName: true,
              filePath: true,
              fileSize: true,
              mimeType: true,
              isVerified: true,
              verifiedBy: true,
              verifiedAt: true,
              rejectionReason: true,
              uploadedAt: true,
            }
          });
          applications[i].documents = anyStudentDocuments;
          console.log(`Fetched ${anyStudentDocuments.length} documents for student ${app.studentId}`);
        }
      }
    }

    console.log('Applications found:', applications.length);
    console.log('Sample application with documents:', applications[0] ? {
      id: applications[0].id,
      studentId: applications[0].studentId,
      documentsCount: applications[0].documents?.length || 0,
      documents: applications[0].documents
    } : 'No applications found');

    // Debug: Check all documents for this student
    if (applications.length > 0) {
      const studentId = applications[0].studentId;
      const allDocuments = await this.prisma.document.findMany({
        where: { studentId },
        select: {
          id: true,
          applicationId: true,
          fileName: true,
          type: true,
          uploadedAt: true,
        }
      });
      console.log('All documents for student:', studentId, allDocuments);

      // Debug: Check all documents in database
      const allDocumentsInDB = await this.prisma.document.findMany({
        select: {
          id: true,
          studentId: true,
          applicationId: true,
          fileName: true,
          type: true,
          uploadedAt: true,
        }
      });
      console.log('All documents in database:', allDocumentsInDB);

      // Manual fix: Create document records for existing files
      if (allDocumentsInDB.length === 0) {
        console.log('No documents found in database, creating manual records...');
        const fs = require('fs');
        const path = require('path');
        const uploadsDir = path.join(process.cwd(), 'uploads', 'documents');
        
        try {
          const files = fs.readdirSync(uploadsDir);
          console.log('Found files in uploads directory:', files);
          
          for (const file of files) {
            const filePath = path.join(uploadsDir, file);
            const stats = fs.statSync(filePath);
            
            // Determine document type based on filename
            let docType = 'OTHER';
            if (file.includes('aadhar') || file.includes('AADHAR')) docType = 'AADHAR_CARD';
            else if (file.includes('photo') || file.includes('PHOTO')) docType = 'PHOTOGRAPH';
            else if (file.includes('mark') || file.includes('MARK')) docType = 'MARK_SHEET_12TH';
            else if (file.includes('income') || file.includes('INCOME')) docType = 'INCOME_CERTIFICATE';
            
            const document = await this.prisma.document.create({
              data: {
                fileName: file,
                originalName: file,
                filePath: `/uploads/documents/${file}`,
                fileSize: stats.size,
                mimeType: file.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
                type: docType as any,
                studentId: studentId,
                applicationId: applications[0].id,
                uploadedAt: new Date(),
              }
            });
            console.log('Created document record:', document.id, file);
          }
        } catch (error) {
          console.error('Error creating manual document records:', error);
        }
      }

      // Temporary fix: Link documents without applicationId to the first application
      const unlinkedDocuments = allDocuments.filter(doc => !doc.applicationId);
      if (unlinkedDocuments.length > 0 && applications[0]) {
        console.log('Linking unlinked documents to application:', applications[0].id);
        for (const doc of unlinkedDocuments) {
          await this.prisma.document.update({
            where: { id: doc.id },
            data: { applicationId: applications[0].id }
          });
        }
        console.log('Linked', unlinkedDocuments.length, 'documents to application');
      }
    }

    const total = await this.prisma.application.count({ where });

    return {
      applications,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  async findOne(id: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        student: true,
        scholarship: true,
        documents: {
          select: {
            id: true,
            type: true,
            fileName: true,
            originalName: true,
            filePath: true,
            fileSize: true,
            mimeType: true,
            isVerified: true,
            verifiedBy: true,
            verifiedAt: true,
            rejectionReason: true,
            uploadedAt: true,
          }
        },
        payments: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    console.log('Application found:', {
      id: application.id,
      documentsCount: application.documents?.length || 0,
      documents: application.documents
    });

    return application;
  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto) {
    return this.prisma.application.update({
      where: { id },
      data: {
        status: updateApplicationDto.status as any,
        additionalInfo: updateApplicationDto.additionalInfo,
      },
    });
  }

  async review(id: string, reviewApplicationDto: ReviewApplicationDto) {
    return this.prisma.application.update({
      where: { id },
      data: {
        status: reviewApplicationDto.status,
        reviewedAt: new Date(),
      },
    });
  }

  async reviewApplication(id: string, reviewDto: ReviewApplicationDto) {
    return this.review(id, reviewDto);
  }

  async approveApplication(id: string, adminNotes: string) {
    return this.prisma.application.update({
      where: { id },
      data: {
        status: 'APPROVED' as any,
        approvedAt: new Date(),
      },
    });
  }

  async rejectApplication(id: string, reason: string, adminNotes?: string) {
    return this.prisma.application.update({
      where: { id },
      data: {
        status: 'REJECTED' as any,
        rejectedAt: new Date(),
        rejectionReason: reason,
        adminNotes: adminNotes,
      },
    });
  }

  async getStats() {
    const total = await this.prisma.application.count();
    const approved = await this.prisma.application.count({
      where: { status: 'APPROVED' },
    });
    const pending = await this.prisma.application.count({
      where: { status: 'PENDING' },
    });
    const rejected = await this.prisma.application.count({
      where: { status: 'REJECTED' },
    });

    // Calculate total amount disbursed from payments
    const totalAmountDisbursed = await this.prisma.payment.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true },
    });

    // Get additional stats
    const totalStudents = await this.prisma.student.count();
    const totalScholarships = await this.prisma.scholarship.count();

    return {
      total,
      approved,
      pending,
      rejected,
      totalAmountDisbursed: totalAmountDisbursed._sum.amount || 0,
      totalStudents,
      totalScholarships,
    };
  }

  async bulkActions(bulkActionDto: any) {
    // Mock implementation
    return { message: 'Bulk actions completed' };
  }

  async remove(id: string) {
    return this.prisma.application.delete({
      where: { id },
    });
  }
}
