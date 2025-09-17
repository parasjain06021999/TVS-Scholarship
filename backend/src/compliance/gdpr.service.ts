import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GdprService {
  constructor(private prisma: PrismaService) {}

  async getUserConsent(userId: string, requestingUser: any) {
    try {
      // Check if user has permission to view this data
      if (requestingUser.role !== 'ADMIN' && requestingUser.id !== userId) {
        throw new ForbiddenException('Access denied');
      }

      const consent = await this.prisma.consentRecord.findFirst({
        where: { userId },
        // orderBy: { updatedAt: 'desc' }, // Field doesn't exist in schema
      });

      return {
        success: true,
        data: consent || {
          userId,
          status: 'PENDING',
          consentGiven: false,
          consentDate: null,
          consentVersion: '1.0',
        },
      };
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new Error(`Failed to get user consent: ${error.message}`);
    }
  }

  async updateUserConsent(consentData: any, userId: string) {
    try {
      const consent = await this.prisma.consentRecord.create({
        data: {
          userId,
          status: consentData.status || 'ACTIVE',
          // consentGiven: consentData.consentGiven, // Field doesn't exist in schema
          // consentDate: new Date(), // Field doesn't exist in schema
          consentVersion: consentData.consentVersion || '1.0',
          purpose: consentData.purpose || 'General data processing',
          dataTypes: consentData.dataTypes || ['personal', 'contact', 'academic'],
          // retentionPeriod: consentData.retentionPeriod || 365, // days // Field doesn't exist in schema
          // metadata: consentData.metadata || {}, // Field doesn't exist in schema
        } as any,
      });

      return {
        success: true,
        message: 'Consent updated successfully',
        data: consent,
      };
    } catch (error) {
      throw new Error(`Failed to update user consent: ${error.message}`);
    }
  }

  async exportUserData(userId: string, requestingUser: any) {
    try {
      // Check if user has permission to export this data
      if (requestingUser.role !== 'ADMIN' && requestingUser.id !== userId) {
        throw new ForbiddenException('Access denied');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          student: true,
          // applications: {
          //   include: {
          //     scholarship: true,
          //     documents: true,
          //   },
          // },
          // payments: true,
          // notifications: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Remove sensitive fields
      const exportData = {
        personalInfo: {
          id: user.id,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          // lastLogin: user.lastLogin, // Field doesn't exist in schema
        },
        studentProfile: user.student ? {
          firstName: user.student.firstName,
          lastName: user.student.lastName,
          dateOfBirth: user.student.dateOfBirth,
          gender: user.student.gender,
          phone: user.student.phone,
          address: user.student.address,
        } : null,
        // applications: user.applications.map(app => ({
        //   id: app.id,
        //   status: app.status,
        //   submittedAt: app.submittedAt,
        //   scholarshipTitle: app.scholarship?.title,
        //   amount: app.scholarship?.amount,
        // })),
        // payments: user.payments.map(payment => ({
        //   id: payment.id,
        //   amount: payment.amount,
        //   status: payment.status,
        //   disbursedAt: payment.disbursedAt,
        // })),
        exportedAt: new Date().toISOString(),
      };

      return {
        success: true,
        data: exportData,
      };
    } catch (error) {
      if (error instanceof ForbiddenException || error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to export user data: ${error.message}`);
    }
  }

  async deleteUserData(userId: string, requestingUser: any) {
    try {
      // Only admin can delete user data
      if (requestingUser.role !== 'ADMIN') {
        throw new ForbiddenException('Only administrators can delete user data');
      }

      // Check if user exists
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Delete user data in correct order (respecting foreign key constraints)
      await this.prisma.consentRecord.deleteMany({ where: { userId } });
      await this.prisma.notification.deleteMany({ where: { userId } });
      await this.prisma.payment.deleteMany({ where: { application: { student: { userId } } } });
      await this.prisma.document.deleteMany({ where: { studentId: userId } });
      await this.prisma.application.deleteMany({ where: { student: { userId } } });
      await this.prisma.student.deleteMany({ where: { userId } });
      await this.prisma.user.delete({ where: { id: userId } });

      return {
        success: true,
        message: 'User data deleted successfully',
      };
    } catch (error) {
      if (error instanceof ForbiddenException || error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to delete user data: ${error.message}`);
    }
  }

  async getGdprAuditTrail(requestingUser: any) {
    try {
      // Only admin can view GDPR audit trail
      if (requestingUser.role !== 'ADMIN') {
        throw new ForbiddenException('Access denied');
      }

      const auditTrail = await this.prisma.auditLog.findMany({
        where: {
          OR: [
            { action: { contains: 'CONSENT' } },
            { action: { contains: 'DATA_EXPORT' } },
            { action: { contains: 'DATA_DELETION' } },
            // { resource: { contains: 'GDPR' } }, // Field doesn't exist in schema
          ],
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        success: true,
        data: auditTrail,
      };
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new Error(`Failed to get GDPR audit trail: ${error.message}`);
    }
  }

  async requestUserConsent(consentRequest: any, requestedBy: string) {
    try {
      // Create consent request
      const request = await this.prisma.consentRecord.create({
        data: {
          userId: consentRequest.userId,
          status: 'PENDING',
          // consentGiven: false, // Field doesn't exist in schema
          consentVersion: consentRequest.consentVersion || '1.0',
          purpose: consentRequest.purpose || 'Data processing consent',
          dataTypes: consentRequest.dataTypes || ['personal', 'contact'],
          // retentionPeriod: consentRequest.retentionPeriod || 365, // Field doesn't exist in schema
          // requestedBy, // Field doesn't exist in schema
          // metadata: {
          //   requestReason: consentRequest.reason,
          //   requestedAt: new Date().toISOString(),
          // }, // Field doesn't exist in schema
        } as any,
      });

      // TODO: Send notification to user about consent request
      // This would typically trigger an email or in-app notification

      return {
        success: true,
        message: 'Consent request created successfully',
        data: request,
      };
    } catch (error) {
      throw new Error(`Failed to request user consent: ${error.message}`);
    }
  }
}
