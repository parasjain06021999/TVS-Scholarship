import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLoggerService {
  constructor(private prisma: PrismaService) {}

  async createAuditLog(auditData: any, userId: string) {
    try {
      const auditLog = await this.prisma.auditLog.create({
        data: {
          userId,
          action: auditData.action,
          // resource: auditData.resource, // Field doesn't exist in schema
          // resourceId: auditData.resourceId, // Field doesn't exist in schema
          // details: auditData.details || {}, // Field doesn't exist in schema
          ipAddress: auditData.ipAddress,
          userAgent: auditData.userAgent,
          sessionId: auditData.sessionId,
          riskLevel: auditData.riskLevel || 'LOW',
          outcome: auditData.outcome || 'SUCCESS',
        } as any,
      });

      return {
        success: true,
        message: 'Audit log created successfully',
        data: auditLog,
      };
    } catch (error) {
      throw new Error(`Failed to create audit log: ${error.message}`);
    }
  }

  async getAuditLogs(user: any) {
    try {
      const where: any = {};

      // Non-admin users can only see their own audit logs
      if (user.role !== 'ADMIN') {
        where.userId = user.id;
      }

      const auditLogs = await this.prisma.auditLog.findMany({
        where,
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
        take: 100, // Limit to last 100 entries
      });

      return {
        success: true,
        data: auditLogs,
      };
    } catch (error) {
      throw new Error(`Failed to fetch audit logs: ${error.message}`);
    }
  }

  async logUserAction(
    userId: string,
    action: string,
    resource: string,
    resourceId: string,
    details: any = {},
    ipAddress?: string,
    userAgent?: string,
  ) {
    try {
      await this.createAuditLog({
        action,
        resource,
        resourceId,
        details,
        ipAddress,
        userAgent,
        sessionId: details.sessionId,
        riskLevel: this.assessRiskLevel(action, details),
        outcome: 'SUCCESS',
      }, userId);
    } catch (error) {
      console.error('Failed to log user action:', error);
    }
  }

  private assessRiskLevel(action: string, details: any): string {
    const highRiskActions = ['DELETE', 'UPDATE_PASSWORD', 'CHANGE_ROLE', 'DISBURSE_PAYMENT'];
    const mediumRiskActions = ['UPDATE', 'CREATE', 'LOGIN', 'LOGOUT'];

    if (highRiskActions.some(riskAction => action.includes(riskAction))) {
      return 'HIGH';
    }

    if (mediumRiskActions.some(riskAction => action.includes(riskAction))) {
      return 'MEDIUM';
    }

    return 'LOW';
  }
}
