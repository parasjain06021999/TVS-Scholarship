import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { NotificationsService } from '../notifications/notifications.service';

export interface CommunicationData {
  title: string;
  content: string;
  type: 'EMAIL' | 'SMS' | 'PUSH' | 'ANNOUNCEMENT';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  targetAudience: {
    type: 'ALL' | 'STUDENTS' | 'ADMINS' | 'REVIEWERS' | 'CUSTOM';
    userIds?: string[];
    filters?: {
      state?: string;
      scholarshipId?: string;
      applicationStatus?: string;
      userRole?: string;
    };
  };
  scheduledAt?: Date;
  templateId?: string;
  metadata?: any;
}

@Injectable()
export class CommunicationsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private notificationsService: NotificationsService,
  ) {}

  /**
   * Create and send communication
   */
  async createCommunication(data: CommunicationData): Promise<any> {
    try {
      // Create communication record
      const communication = await this.prisma.communication.create({
        data: {
          title: data.title,
          content: data.content,
          type: data.type,
          priority: data.priority,
          targetAudience: data.targetAudience,
          scheduledAt: data.scheduledAt,
          templateId: data.templateId,
          metadata: data.metadata,
          status: 'PENDING',
        },
      });

      // Get target users
      const targetUsers = await this.getTargetUsers(data.targetAudience);

      // Send communication based on type
      switch (data.type) {
        case 'EMAIL':
          await this.sendEmailCommunication(communication, targetUsers);
          break;
        case 'SMS':
          await this.sendSMSCommunication(communication, targetUsers);
          break;
        case 'PUSH':
          await this.sendPushCommunication(communication, targetUsers);
          break;
        case 'ANNOUNCEMENT':
          await this.sendAnnouncementCommunication(communication, targetUsers);
          break;
      }

      // Update communication status
      await this.prisma.communication.update({
        where: { id: communication.id },
        data: { status: 'SENT' },
      });

      return communication;
    } catch (error) {
      console.error('Failed to create communication:', error);
      throw error;
    }
  }

  /**
   * Get target users based on audience criteria
   */
  private async getTargetUsers(targetAudience: CommunicationData['targetAudience']): Promise<any[]> {
    const { type, userIds, filters } = targetAudience;

    if (type === 'CUSTOM' && userIds) {
      return this.prisma.user.findMany({
        where: { id: { in: userIds } },
        include: { student: true },
      });
    }

    if (type === 'ALL') {
      return this.prisma.user.findMany({
        include: { student: true },
      });
    }

    if (type === 'STUDENTS') {
      return this.prisma.user.findMany({
        where: { role: 'STUDENT' },
        include: { student: true },
      });
    }

    if (type === 'ADMINS') {
      return this.prisma.user.findMany({
        where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
        include: { student: true },
      });
    }

    if (type === 'REVIEWERS') {
      return this.prisma.user.findMany({
        where: { role: 'REVIEWER' },
        include: { student: true },
      });
    }

    // Apply filters
    const where: any = {};
    if (filters?.userRole) {
      where.role = filters.userRole;
    }

    if (filters?.state) {
      where.student = {
        state: filters.state,
      };
    }

    if (filters?.scholarshipId) {
      where.applications = {
        some: {
          scholarshipId: filters.scholarshipId,
        },
      };
    }

    if (filters?.applicationStatus) {
      where.applications = {
        some: {
          status: filters.applicationStatus,
        },
      };
    }

    return this.prisma.user.findMany({
      where,
      include: { student: true },
    });
  }

  /**
   * Send email communication
   */
  private async sendEmailCommunication(communication: any, users: any[]): Promise<void> {
    for (const user of users) {
      if (user.email) {
        try {
          await this.mailService.sendBulkEmail(
            user.email,
            communication.title,
            communication.content,
            communication.templateId,
          );
        } catch (error) {
          console.error(`Failed to send email to ${user.email}:`, error);
        }
      }
    }
  }

  /**
   * Send SMS communication
   */
  private async sendSMSCommunication(communication: any, users: any[]): Promise<void> {
    for (const user of users) {
      if (user.student?.phone) {
        try {
          // This would integrate with your SMS service
          console.log(`SMS sent to ${user.student.phone}: ${communication.title}`);
        } catch (error) {
          console.error(`Failed to send SMS to ${user.student.phone}:`, error);
        }
      }
    }
  }

  /**
   * Send push communication
   */
  private async sendPushCommunication(communication: any, users: any[]): Promise<void> {
    for (const user of users) {
      try {
        await this.notificationsService.createNotification({
          title: communication.title,
          message: communication.content,
          type: 'ANNOUNCEMENT',
          priority: communication.priority,
          userId: user.id,
          metadata: communication.metadata,
        });
      } catch (error) {
        console.error(`Failed to send push notification to ${user.id}:`, error);
      }
    }
  }

  /**
   * Send announcement communication
   */
  private async sendAnnouncementCommunication(communication: any, users: any[]): Promise<void> {
    // Create announcement record
    await this.prisma.announcement.create({
      data: {
        title: communication.title,
        content: communication.content,
        priority: communication.priority,
        targetAudience: communication.targetAudience,
        metadata: communication.metadata,
        isActive: true,
      },
    });

    // Send push notifications
    await this.sendPushCommunication(communication, users);
  }

  /**
   * Get communications with filtering
   */
  async getCommunications(filters: {
    type?: string;
    status?: string;
    priority?: string;
    page?: number;
    limit?: number;
  }) {
    const {
      type,
      status,
      priority,
      page = 1,
      limit = 20,
    } = filters;

    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const [communications, total] = await Promise.all([
      this.prisma.communication.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.communication.count({ where }),
    ]);

    return {
      communications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get announcements
   */
  async getAnnouncements(filters: {
    isActive?: boolean;
    priority?: string;
    page?: number;
    limit?: number;
  }) {
    const {
      isActive = true,
      priority,
      page = 1,
      limit = 20,
    } = filters;

    const where: any = { isActive };
    if (priority) where.priority = priority;

    const [announcements, total] = await Promise.all([
      this.prisma.announcement.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.announcement.count({ where }),
    ]);

    return {
      announcements,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Create email template
   */
  async createEmailTemplate(data: {
    name: string;
    subject: string;
    content: string;
    variables: string[];
    category: string;
  }) {
    return this.prisma.emailTemplate.create({
      data: {
        name: data.name,
        subject: data.subject,
        content: data.content,
        variables: data.variables,
        category: data.category,
        isActive: true,
      },
    });
  }

  /**
   * Get email templates
   */
  async getEmailTemplates(filters: {
    category?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) {
    const {
      category,
      isActive = true,
      page = 1,
      limit = 20,
    } = filters;

    const where: any = { isActive };
    if (category) where.category = category;

    const [templates, total] = await Promise.all([
      this.prisma.emailTemplate.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.emailTemplate.count({ where }),
    ]);

    return {
      templates,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update email template
   */
  async updateEmailTemplate(
    templateId: string,
    data: {
      name?: string;
      subject?: string;
      content?: string;
      variables?: string[];
      category?: string;
      isActive?: boolean;
    },
  ) {
    return this.prisma.emailTemplate.update({
      where: { id: templateId },
      data,
    });
  }

  /**
   * Delete email template
   */
  async deleteEmailTemplate(templateId: string) {
    return this.prisma.emailTemplate.update({
      where: { id: templateId },
      data: { isActive: false },
    });
  }

  /**
   * Get communication statistics
   */
  async getCommunicationStats() {
    const [total, byType, byStatus, byPriority] = await Promise.all([
      this.prisma.communication.count(),
      this.prisma.communication.groupBy({
        by: ['type'],
        _count: { type: true },
      }),
      this.prisma.communication.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      this.prisma.communication.groupBy({
        by: ['priority'],
        _count: { priority: true },
      }),
    ]);

    return {
      total,
      byType: byType.reduce((acc, item) => {
        acc[item.type] = item._count.type;
        return acc;
      }, {}),
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {}),
      byPriority: byPriority.reduce((acc, item) => {
        acc[item.priority] = item._count.priority;
        return acc;
      }, {}),
    };
  }

  /**
   * Schedule communication
   */
  async scheduleCommunication(
    communicationId: string,
    scheduledAt: Date,
  ) {
    return this.prisma.communication.update({
      where: { id: communicationId },
      data: {
        scheduledAt,
        status: 'SCHEDULED',
      },
    });
  }

  /**
   * Cancel communication
   */
  async cancelCommunication(communicationId: string) {
    return this.prisma.communication.update({
      where: { id: communicationId },
      data: { status: 'CANCELLED' },
    });
  }

  /**
   * Get scheduled communications
   */
  async getScheduledCommunications() {
    return this.prisma.communication.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledAt: {
          lte: new Date(),
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  /**
   * Process scheduled communications
   */
  async processScheduledCommunications() {
    const scheduledCommunications = await this.getScheduledCommunications();

    for (const communication of scheduledCommunications) {
      try {
        const targetUsers = await this.getTargetUsers(communication.targetAudience);
        
        // Send communication based on type
        switch (communication.type) {
          case 'EMAIL':
            await this.sendEmailCommunication(communication, targetUsers);
            break;
          case 'SMS':
            await this.sendSMSCommunication(communication, targetUsers);
            break;
          case 'PUSH':
            await this.sendPushCommunication(communication, targetUsers);
            break;
          case 'ANNOUNCEMENT':
            await this.sendAnnouncementCommunication(communication, targetUsers);
            break;
        }

        // Update status
        await this.prisma.communication.update({
          where: { id: communication.id },
          data: { status: 'SENT' },
        });
      } catch (error) {
        console.error(`Failed to process scheduled communication ${communication.id}:`, error);
        
        // Update status to failed
        await this.prisma.communication.update({
          where: { id: communication.id },
          data: { status: 'FAILED' },
        });
      }
    }
  }
}
