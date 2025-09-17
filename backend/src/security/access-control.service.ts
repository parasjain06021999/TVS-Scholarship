import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccessControlService {
  constructor(private prisma: PrismaService) {}

  async getUserPermissions(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          role: true,
          isActive: true,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const permissions = this.getRolePermissions(user.role);

      return {
        success: true,
        data: {
          userId: user.id,
          role: user.role,
          isActive: user.isActive,
          permissions,
        },
      };
    } catch (error) {
      throw new Error(`Failed to get user permissions: ${error.message}`);
    }
  }

  private getRolePermissions(role: string) {
    const rolePermissions = {
      ADMIN: [
        'READ_ALL_APPLICATIONS',
        'WRITE_ALL_APPLICATIONS',
        'READ_ALL_STUDENTS',
        'WRITE_ALL_STUDENTS',
        'READ_ALL_SCHOLARSHIPS',
        'WRITE_ALL_SCHOLARSHIPS',
        'READ_ALL_PAYMENTS',
        'WRITE_ALL_PAYMENTS',
        'READ_ALL_DOCUMENTS',
        'WRITE_ALL_DOCUMENTS',
        'READ_ALL_REPORTS',
        'WRITE_ALL_REPORTS',
        'READ_ALL_COMMUNICATIONS',
        'WRITE_ALL_COMMUNICATIONS',
        'READ_ALL_AUDIT_LOGS',
        'MANAGE_USERS',
        'MANAGE_SYSTEM',
      ],
      REVIEWER: [
        'READ_ALL_APPLICATIONS',
        'WRITE_APPLICATION_STATUS',
        'READ_ALL_STUDENTS',
        'READ_ALL_SCHOLARSHIPS',
        'READ_ALL_DOCUMENTS',
        'READ_ALL_REPORTS',
        'READ_ALL_COMMUNICATIONS',
        'WRITE_COMMUNICATIONS',
      ],
      STUDENT: [
        'READ_OWN_APPLICATIONS',
        'WRITE_OWN_APPLICATIONS',
        'READ_OWN_PROFILE',
        'WRITE_OWN_PROFILE',
        'READ_OWN_DOCUMENTS',
        'WRITE_OWN_DOCUMENTS',
        'READ_OWN_PAYMENTS',
        'READ_OWN_NOTIFICATIONS',
      ],
    };

    return rolePermissions[role] || [];
  }

  async checkPermission(userId: string, permission: string): Promise<boolean> {
    try {
      const userPermissions = await this.getUserPermissions(userId);
      return userPermissions.data.permissions.includes(permission);
    } catch (error) {
      return false;
    }
  }

  async canAccessResource(userId: string, resourceType: string, resourceId?: string): Promise<boolean> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (!user) return false;

      // Admin can access everything
      if (user.role === 'ADMIN') return true;

      // Reviewer can access most resources
      if (user.role === 'REVIEWER') {
        return ['applications', 'students', 'scholarships', 'documents', 'reports'].includes(resourceType);
      }

      // Student can only access their own resources
      if (user.role === 'STUDENT') {
        if (!resourceId) return false;

        switch (resourceType) {
          case 'applications':
            const application = await this.prisma.application.findUnique({
              where: { id: resourceId },
              select: { student: { select: { userId: true } } },
            });
            return application?.student.userId === userId;

          case 'students':
            return resourceId === userId;

          case 'documents':
            const document = await this.prisma.document.findUnique({
              where: { id: resourceId },
              select: { studentId: true },
            });
            return document?.studentId === userId;

          default:
            return false;
        }
      }

      return false;
    } catch (error) {
      return false;
    }
  }
}
