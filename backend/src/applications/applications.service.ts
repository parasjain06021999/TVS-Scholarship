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
        documents: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

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
        documents: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log('Applications found:', applications.length);

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
        documents: true,
        payments: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

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
