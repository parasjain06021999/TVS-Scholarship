import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface AuditLogEntry {
  timestamp: Date;
  userId: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  outcome: 'success' | 'failure';
  details?: any;
  risk_level: 'low' | 'medium' | 'high';
  sessionId?: string;
}

@Injectable()
export class AuditLoggerService {
  constructor(private prisma: PrismaService) {}

  // High-risk actions requiring detailed logging
  private static readonly HIGH_RISK_ACTIONS = [
    'user.delete',
    'payment.process',
    'application.approve',
    'application.reject',
    'system.backup',
    'data.export',
    'access.elevated',
    'password.reset',
    'consent.withdrawn',
    'data.anonymized',
  ];

  /**
   * Log audit entry to database
   */
  async log(entry: AuditLogEntry): Promise<void> {
    try {
      // Determine risk level
      const riskLevel = this.determineRiskLevel(entry.action, entry.outcome);
      
      // Create audit log entry
      await this.prisma.auditLog.create({
        data: {
          userId: entry.userId,
          action: entry.action,
          entity: entry.resource,
          entityId: entry.resourceId,
          newValues: entry.details,
          ipAddress: entry.ipAddress,
          userAgent: entry.userAgent,
          riskLevel,
          outcome: entry.outcome,
          sessionId: entry.sessionId || `${entry.userId}_${Date.now()}`,
        },
      });

      // For high-risk actions, also log to security monitoring
      if (riskLevel === 'high') {
        await this.logToSecurityMonitoring(entry);
      }

      // Schedule log retention
      await this.scheduleLogRetention(entry);
    } catch (error) {
      console.error('Failed to log audit entry:', error);
      // Don't throw error to avoid breaking the main flow
    }
  }

  /**
   * Log high-risk action to security monitoring
   */
  private async logToSecurityMonitoring(entry: AuditLogEntry): Promise<void> {
    // This would integrate with your security monitoring system
    console.warn('HIGH RISK ACTION DETECTED:', {
      action: entry.action,
      userId: entry.userId,
      resource: entry.resource,
      timestamp: entry.timestamp,
      ipAddress: entry.ipAddress,
    });

    // Send alert to security team
    await this.sendSecurityAlert(entry);
  }

  /**
   * Send security alert
   */
  private async sendSecurityAlert(entry: AuditLogEntry): Promise<void> {
    // This would integrate with your alerting system
    const alert = {
      severity: 'high',
      title: 'High Risk Action Detected',
      message: `User ${entry.userId} performed high-risk action: ${entry.action}`,
      details: {
        userId: entry.userId,
        userRole: entry.userRole,
        action: entry.action,
        resource: entry.resource,
        resourceId: entry.resourceId,
        ipAddress: entry.ipAddress,
        timestamp: entry.timestamp,
      },
    };

    // Send to security monitoring system
    console.log('Security Alert:', alert);
  }

  /**
   * Determine risk level based on action and outcome
   */
  private determineRiskLevel(action: string, outcome: string): 'low' | 'medium' | 'high' {
    if (AuditLoggerService.HIGH_RISK_ACTIONS.includes(action)) {
      return 'high';
    }

    if (outcome === 'failure' && action.includes('login')) {
      return 'high';
    }

    if (action.includes('delete') || action.includes('export')) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Schedule log retention (7 years for SOC 2 compliance)
   */
  private async scheduleLogRetention(entry: AuditLogEntry): Promise<void> {
    const retentionPeriod = 7 * 365 * 24 * 60 * 60 * 1000; // 7 years in milliseconds
    const retentionDate = new Date(entry.timestamp.getTime() + retentionPeriod);

    // This would integrate with your job scheduling system
    console.log(`Log retention scheduled for ${retentionDate.toISOString()}`);
  }

  /**
   * Log user authentication attempt
   */
  async logAuthenticationAttempt(
    userId: string,
    userRole: string,
    success: boolean,
    ipAddress: string,
    userAgent: string,
    details?: any
  ): Promise<void> {
    await this.log({
      timestamp: new Date(),
      userId,
      userRole,
      action: success ? 'auth.login_success' : 'auth.login_failed',
      resource: 'authentication',
      ipAddress,
      userAgent,
      outcome: success ? 'success' : 'failure',
      details,
      risk_level: success ? 'low' : 'high',
    });
  }

  /**
   * Log data access
   */
  async logDataAccess(
    userId: string,
    userRole: string,
    resource: string,
    resourceId: string,
    action: string,
    ipAddress: string,
    userAgent: string
  ): Promise<void> {
    await this.log({
      timestamp: new Date(),
      userId,
      userRole,
      action: `data.${action}`,
      resource,
      resourceId,
      ipAddress,
      userAgent,
      outcome: 'success',
      risk_level: 'low',
    });
  }

  /**
   * Log data modification
   */
  async logDataModification(
    userId: string,
    userRole: string,
    resource: string,
    resourceId: string,
    action: string,
    oldValues: any,
    newValues: any,
    ipAddress: string,
    userAgent: string
  ): Promise<void> {
    await this.log({
      timestamp: new Date(),
      userId,
      userRole,
      action: `data.${action}`,
      resource,
      resourceId,
      ipAddress,
      userAgent,
      outcome: 'success',
      details: { oldValues, newValues },
      risk_level: 'medium',
    });
  }

  /**
   * Log system events
   */
  async logSystemEvent(
    event: string,
    details: any,
    severity: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<void> {
    await this.log({
      timestamp: new Date(),
      userId: 'system',
      userRole: 'system',
      action: `system.${event}`,
      resource: 'system',
      ipAddress: '127.0.0.1',
      userAgent: 'TVS-Scholarship-System',
      outcome: 'success',
      details,
      risk_level: severity,
    });
  }

  /**
   * Log security events
   */
  async logSecurityEvent(
    event: string,
    userId: string,
    userRole: string,
    details: any,
    ipAddress: string,
    userAgent: string
  ): Promise<void> {
    await this.log({
      timestamp: new Date(),
      userId,
      userRole,
      action: `security.${event}`,
      resource: 'security',
      ipAddress,
      userAgent,
      outcome: 'success',
      details,
      risk_level: 'high',
    });
  }

  /**
   * Get audit logs with filtering
   */
  async getAuditLogs(filters: {
    userId?: string;
    action?: string;
    resource?: string;
    riskLevel?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const {
      userId,
      action,
      resource,
      riskLevel,
      startDate,
      endDate,
      page = 1,
      limit = 50,
    } = filters;

    const where: any = {};

    if (userId) where.userId = userId;
    if (action) where.action = { contains: action };
    if (resource) where.entity = resource;
    if (riskLevel) where.riskLevel = riskLevel;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Clean up old audit logs
   */
  async cleanupOldLogs(): Promise<void> {
    const retentionDate = new Date();
    retentionDate.setFullYear(retentionDate.getFullYear() - 7);

    await this.prisma.auditLog.deleteMany({
      where: {
        createdAt: {
          lt: retentionDate,
        },
      },
    });

    console.log(`Cleaned up audit logs older than ${retentionDate.toISOString()}`);
  }
}
