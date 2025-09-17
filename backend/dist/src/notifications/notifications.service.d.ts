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
export declare class NotificationsService {
    private prisma;
    private mailService;
    constructor(prisma: PrismaService, mailService: MailService);
    create(data: any, userId?: string): Promise<any>;
    createNotification(data: NotificationData): Promise<void>;
    private sendRealTimeNotification;
    private sendEmailNotification;
    private sendSMSNotification;
    getUserNotifications(userId: string, page?: number, limit?: number, unreadOnly?: boolean): Promise<{
        notifications: {
            data: import("@prisma/client/runtime/library").JsonValue | null;
            id: string;
            createdAt: Date;
            userId: string;
            title: string;
            priority: string | null;
            type: import(".prisma/client").$Enums.NotificationType;
            message: string;
            isRead: boolean;
            readAt: Date | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    markAsRead(notificationId: string, userId: string): Promise<void>;
    markAllAsRead(userId: string): Promise<void>;
    deleteNotification(notificationId: string, userId: string): Promise<void>;
    getNotificationStats(userId: string): Promise<{
        total: number;
        unread: number;
        byType: {};
    }>;
    sendBulkNotifications(userIds: string[], data: Omit<NotificationData, 'userId'>): Promise<void>;
    sendApplicationStatusNotification(applicationId: string, status: string, studentId: string): Promise<void>;
    sendPaymentNotification(paymentId: string, status: string, amount: number, studentId: string): Promise<void>;
    sendDocumentRequestNotification(applicationId: string, documentType: string, studentId: string): Promise<void>;
    sendDeadlineReminder(applicationId: string, deadline: Date, studentId: string): Promise<void>;
}
