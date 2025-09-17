import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { NotificationType } from '@prisma/client';

export interface NotificationData {
  title: string;
  message: string;
  type: NotificationType;
  priority?: string;
  userId?: string;
  applicationId?: string;
  scholarshipId?: string;
  metadata?: any;
}

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  /**
   * Create and send notification
   */
  async create(data: any, userId?: string): Promise<any> {
    return this.prisma.notification.create({
      data: {
        title: data.title,
        message: data.message,
        type: data.type || 'INFO',
        userId: userId || data.userId,
        isRead: false,
        data: data.data || {},
      },
    });
  }

  async createNotification(data: NotificationData): Promise<void> {
    try {
      // Create notification record
      const notification = await this.prisma.notification.create({
        data: {
          title: data.title,
          message: data.message,
          type: data.type,
          priority: data.priority || 'MEDIUM',
          userId: data.userId,
          data: data.metadata,
        },
      });

      // Send real-time notification via WebSocket
      await this.sendRealTimeNotification(notification);

      // Send email notification for high priority
      if (data.priority === 'HIGH') {
        await this.sendEmailNotification(notification);
      }

      // Send SMS notification for urgent
      if (data.priority === 'URGENT') {
        await this.sendSMSNotification(notification);
      }

    } catch (error) {
      console.error('Failed to create notification:', error);
      throw error;
    }
  }

  /**
   * Send real-time notification via WebSocket
   */
  private async sendRealTimeNotification(notification: any): Promise<void> {
    // This would integrate with your WebSocket service
    console.log('Real-time notification sent:', notification.id);
  }

  /**
   * Send email notification
   */
  private async sendEmailNotification(notification: any): Promise<void> {
    if (!notification.userId) return;

    const user = await this.prisma.user.findUnique({
      where: { id: notification.userId },
      include: { student: true },
    });

    if (user?.email) {
      await this.mailService.sendNotificationEmail(
        user.email,
        notification.title,
        notification.message,
        notification.type,
      );
    }
  }

  /**
   * Send SMS notification
   */
  private async sendSMSNotification(notification: any): Promise<void> {
    if (!notification.userId) return;

    const user = await this.prisma.user.findUnique({
      where: { id: notification.userId },
      include: { student: true },
    });

    if (user?.student?.phone) {
      // This would integrate with your SMS service
      console.log('SMS notification sent to:', user.student.phone);
    }
  }

  /**
   * Get notifications for user
   */
  async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20,
    unreadOnly: boolean = false,
  ) {
    const where: any = { userId };
    if (unreadOnly) {
      where.read = false;
    }

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        isRead: true,
        // readAt: new Date(), // Field doesn't exist in schema
      },
    });
  }

  /**
   * Mark all notifications as read for user
   */
  async markAllAsRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        // readAt: new Date(), // Field doesn't exist in schema
      },
    });
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    await this.prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId,
      },
    });
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(userId: string) {
    const [total, unread, byType] = await Promise.all([
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
      this.prisma.notification.groupBy({
        by: ['type'],
        where: { userId },
        _count: { type: true },
      }),
    ]);

    return {
      total,
      unread,
      byType: byType.reduce((acc, item) => {
        acc[item.type] = item._count.type;
        return acc;
      }, {}),
    };
  }

  /**
   * Send bulk notifications
   */
  async sendBulkNotifications(
    userIds: string[],
    data: Omit<NotificationData, 'userId'>,
  ): Promise<void> {
    const notifications = userIds.map(userId => ({
      ...data,
      userId,
    }));

    await this.prisma.notification.createMany({
      data: notifications,
    });

    // Send real-time notifications
    for (const notification of notifications) {
      await this.sendRealTimeNotification(notification);
    }
  }

  /**
   * Send application status notification
   */
  async sendApplicationStatusNotification(
    applicationId: string,
    status: string,
    studentId: string,
  ): Promise<void> {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        student: { include: { user: true } },
        scholarship: true,
      },
    });

    if (!application) return;

    const statusMessages = {
      SUBMITTED: 'Your application has been submitted successfully.',
      UNDER_REVIEW: 'Your application is under review.',
      SHORTLISTED: 'Congratulations! Your application has been shortlisted.',
      APPROVED: 'Congratulations! Your application has been approved.',
      REJECTED: 'Your application has been rejected.',
    };

    await this.createNotification({
      title: `Application ${status}`,
      message: statusMessages[status] || `Your application status has been updated to ${status}.`,
      type: 'APPLICATION_UPDATE',
      priority: status === 'APPROVED' ? 'HIGH' : 'MEDIUM',
      userId: application.student.userId,
      applicationId,
      scholarshipId: application.scholarshipId,
      metadata: { status, scholarshipTitle: application.scholarship.title },
    });
  }

  /**
   * Send payment notification
   */
  async sendPaymentNotification(
    paymentId: string,
    status: string,
    amount: number,
    studentId: string,
  ): Promise<void> {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        application: {
          include: {
            student: { include: { user: true } },
            scholarship: true,
          },
        },
      },
    });

    if (!payment) return;

    const statusMessages = {
      PENDING: 'Your payment is being processed.',
      COMPLETED: `Payment of ₹${amount} has been successfully processed.`,
      FAILED: 'Your payment has failed. Please try again.',
      CANCELLED: 'Your payment has been cancelled.',
    };

    await this.createNotification({
      title: `Payment ${status}`,
      message: statusMessages[status] || `Your payment status has been updated to ${status}.`,
      type: 'PAYMENT_UPDATE',
      priority: status === 'COMPLETED' ? 'HIGH' : 'MEDIUM',
      userId: payment.application.student.userId,
      applicationId: payment.applicationId,
      metadata: { status, amount, scholarshipTitle: payment.application.scholarship.title },
    });
  }

  /**
   * Send document request notification
   */
  async sendDocumentRequestNotification(
    applicationId: string,
    documentType: string,
    studentId: string,
  ): Promise<void> {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        student: { include: { user: true } },
        scholarship: true,
      },
    });

    if (!application) return;

    await this.createNotification({
      title: 'Document Required',
      message: `Please upload your ${documentType} document to complete your application.`,
      type: 'DOCUMENT_REQUEST',
      priority: 'HIGH',
      userId: application.student.userId,
      applicationId,
      scholarshipId: application.scholarshipId,
      metadata: { documentType, scholarshipTitle: application.scholarship.title },
    });
  }

  /**
   * Send deadline reminder
   */
  async sendDeadlineReminder(
    applicationId: string,
    deadline: Date,
    studentId: string,
  ): Promise<void> {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        student: { include: { user: true } },
        scholarship: true,
      },
    });

    if (!application) return;

    const daysLeft = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    await this.createNotification({
      title: 'Deadline Reminder',
      message: `Your application deadline is in ${daysLeft} days. Please complete your application soon.`,
      type: 'DEADLINE_REMINDER',
      priority: daysLeft <= 3 ? 'URGENT' : 'MEDIUM',
      userId: application.student.userId,
      applicationId,
      scholarshipId: application.scholarshipId,
      metadata: { deadline, daysLeft, scholarshipTitle: application.scholarship.title },
    });
  }
}
