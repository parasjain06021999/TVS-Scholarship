import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScholarshipDto } from './dto/create-scholarship.dto';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto';
import { ScholarshipCategory } from '@prisma/client';

@Injectable()
export class ScholarshipsService {
  constructor(private prisma: PrismaService) {}

  async create(createScholarshipDto: CreateScholarshipDto, createdBy: string) {
    const { applicationStartDate, applicationEndDate, ...data } = createScholarshipDto;

    // Validate dates
    const startDate = new Date(applicationStartDate);
    const endDate = new Date(applicationEndDate);
    
    if (startDate >= endDate) {
      throw new BadRequestException('Application end date must be after start date');
    }

    if (startDate < new Date()) {
      throw new BadRequestException('Application start date cannot be in the past');
    }

    return this.prisma.scholarship.create({
      data: {
        ...data,
        applicationStartDate: startDate,
        applicationEndDate: endDate,
        createdBy,
      },
    });
  }

  async findAll(filters: {
    page: number;
    limit: number;
    search?: string;
    category?: string;
    isActive?: boolean;
    minAmount?: number;
    maxAmount?: number;
  }) {
    const { page, limit, search, category, isActive, minAmount, maxAmount } = filters;
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { subCategory: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    return this.prisma.paginate('scholarship', page, limit, where);
  }

  async findOne(id: string) {
    const scholarship = await this.prisma.scholarship.findUnique({
      where: { id },
      include: {
        applications: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!scholarship) {
      throw new NotFoundException('Scholarship not found');
    }

    return scholarship;
  }

  async update(id: string, updateScholarshipDto: UpdateScholarshipDto) {
    const scholarship = await this.prisma.scholarship.findUnique({
      where: { id },
    });

    if (!scholarship) {
      throw new NotFoundException('Scholarship not found');
    }

    const { applicationStartDate, applicationEndDate, ...data } = updateScholarshipDto;

    // Validate dates if provided
    if (applicationStartDate && applicationEndDate) {
      const startDate = new Date(applicationStartDate);
      const endDate = new Date(applicationEndDate);
      
      if (startDate >= endDate) {
        throw new BadRequestException('Application end date must be after start date');
      }
    }

    return this.prisma.scholarship.update({
      where: { id },
      data: {
        ...data,
        ...(applicationStartDate && { applicationStartDate: new Date(applicationStartDate) }),
        ...(applicationEndDate && { applicationEndDate: new Date(applicationEndDate) }),
      },
    });
  }

  async remove(id: string) {
    const scholarship = await this.prisma.scholarship.findUnique({
      where: { id },
      include: {
        applications: true,
      },
    });

    if (!scholarship) {
      throw new NotFoundException('Scholarship not found');
    }

    if (scholarship.applications.length > 0) {
      throw new BadRequestException('Cannot delete scholarship with existing applications');
    }

    return this.prisma.scholarship.delete({
      where: { id },
    });
  }

  async getEligibleScholarships(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        applications: {
          select: {
            scholarshipId: true,
            status: true,
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const appliedScholarshipIds = student.applications.map(app => app.scholarshipId);

    const scholarships = await this.prisma.scholarship.findMany({
      where: {
        isActive: true,
        applicationEndDate: {
          gte: new Date(),
        },
        id: {
          notIn: appliedScholarshipIds,
        },
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return scholarships;
  }

  async getScholarshipStats(id: string) {
    const scholarship = await this.prisma.scholarship.findUnique({
      where: { id },
      include: {
        applications: true,
      },
    });

    if (!scholarship) {
      throw new NotFoundException('Scholarship not found');
    }

    const stats = {
      totalApplications: scholarship.applications.length,
      approvedApplications: scholarship.applications.filter(app => app.status === 'APPROVED').length,
      pendingApplications: scholarship.applications.filter(app => app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW').length,
      rejectedApplications: scholarship.applications.filter(app => app.status === 'REJECTED').length,
      totalAwardedAmount: scholarship.applications
        .filter(app => app.status === 'APPROVED')
        .reduce((sum, app) => sum + (app.awardedAmount || 0), 0),
      remainingApplications: scholarship.maxApplications ? scholarship.maxApplications - scholarship.applications.length : null,
    };

    return stats;
  }

  async toggleActive(id: string) {
    const scholarship = await this.prisma.scholarship.findUnique({
      where: { id },
    });

    if (!scholarship) {
      throw new NotFoundException('Scholarship not found');
    }

    return this.prisma.scholarship.update({
      where: { id },
      data: { isActive: !scholarship.isActive },
    });
  }

  async toggleStatus(id: string) {
    const scholarship = await this.prisma.scholarship.findUnique({
      where: { id },
    });

    if (!scholarship) {
      throw new NotFoundException('Scholarship not found');
    }

    return this.prisma.scholarship.update({
      where: { id },
      data: { isActive: !scholarship.isActive },
    });
  }

  async findActive() {
    return this.prisma.scholarship.findMany({
      where: {
        isActive: true,
        applicationEndDate: { gte: new Date() },
      },
      orderBy: { priority: 'desc' },
    });
  }

  async getApplications(scholarshipId: string, filters: any) {
    const { page = 1, limit = 10, status } = filters;
    const where: any = { scholarshipId };

    if (status) {
      where.status = status;
    }

    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        skip,
        take: limit,
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.application.count({ where }),
    ]);

    return {
      data: applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getStats() {
    const [total, active, applications, totalAmount] = await Promise.all([
      this.prisma.scholarship.count(),
      this.prisma.scholarship.count({ where: { isActive: true } }),
      this.prisma.application.count(),
      this.prisma.scholarship.aggregate({
        _sum: { amount: true },
      }),
    ]);

    return {
      total,
      active,
      applications,
      totalAmount: totalAmount._sum.amount || 0,
    };
  }

  async checkEligibility(eligibilityData: any) {
    // Mock eligibility check
    return {
      eligible: true,
      reasons: [],
      suggestedScholarships: [],
    };
  }

}
