import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto) {
    // This would typically be called during user registration
    // For now, return a mock response
    return {
      id: 'mock-student-id',
      ...createStudentDto,
      createdAt: new Date(),
    };
  }

  async findAll(filters: {
    page: number;
    limit: number;
    search?: string;
    state?: string;
    isVerified?: boolean;
  }) {
    const { page, limit, search, state, isVerified } = filters;
    const where: any = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (state) {
      where.state = state;
    }

    if (isVerified !== undefined) {
      where.isVerified = isVerified;
    }

    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              email: true,
              isActive: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.student.count({ where }),
    ]);

    return {
      data: students,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async remove(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return this.prisma.student.delete({
      where: { id },
    });
  }

  async getApplications(studentId: string) {
    return this.prisma.application.findMany({
      where: { studentId },
      include: {
        scholarship: {
          select: {
            title: true,
            amount: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDocuments(studentId: string) {
    return this.prisma.document.findMany({
      where: { studentId },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string, userRole: UserRole) {
    // Students can only view their own profile, admins can view any
    if (userRole === UserRole.STUDENT && id !== userId) {
      throw new ForbiddenException('You can only view your own profile');
    }

    console.log('Finding student with ID:', id, 'User ID:', userId, 'Role:', userRole);

    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
          },
        },
        applications: {
          include: {
            scholarship: {
              select: {
                id: true,
                title: true,
                amount: true,
                category: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        documents: {
          orderBy: { uploadedAt: 'desc' },
        },
      },
    });

    console.log('Student found:', student ? 'Yes' : 'No', student ? { id: student.id, firstName: student.firstName, lastName: student.lastName } : null);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto, userId: string, userRole: UserRole) {
    // Students can only update their own profile, admins can update any
    if (userRole === UserRole.STUDENT && id !== userId) {
      throw new ForbiddenException('You can only update your own profile');
    }

    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return this.prisma.student.update({
      where: { id },
      data: updateStudentDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
      },
    });
  }


  async getStudentStats(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        applications: {
          include: {
            scholarship: true,
          },
        },
        documents: true,
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const stats = {
      totalApplications: student.applications.length,
      approvedApplications: student.applications.filter(app => app.status === 'APPROVED').length,
      pendingApplications: student.applications.filter(app => app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW').length,
      rejectedApplications: student.applications.filter(app => app.status === 'REJECTED').length,
      totalDocuments: student.documents.length,
      verifiedDocuments: student.documents.filter(doc => doc.isVerified).length,
      totalAwardedAmount: student.applications
        .filter(app => app.status === 'APPROVED')
        .reduce((sum, app) => sum + (app.awardedAmount || 0), 0),
    };

    return stats;
  }

  async verifyStudent(id: string, userRole: UserRole) {
    if (userRole !== UserRole.ADMIN && userRole !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only admins can verify students');
    }

    return this.prisma.student.update({
      where: { id },
      data: { isVerified: true },
    });
  }
}
