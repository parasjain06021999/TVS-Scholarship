"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
let NotificationsService = class NotificationsService {
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
    }
    async create(data, userId) {
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
    async createNotification(data) {
        try {
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
            await this.sendRealTimeNotification(notification);
            if (data.priority === 'HIGH') {
                await this.sendEmailNotification(notification);
            }
            if (data.priority === 'URGENT') {
                await this.sendSMSNotification(notification);
            }
        }
        catch (error) {
            console.error('Failed to create notification:', error);
            throw error;
        }
    }
    async sendRealTimeNotification(notification) {
        console.log('Real-time notification sent:', notification.id);
    }
    async sendEmailNotification(notification) {
        if (!notification.userId)
            return;
        const user = await this.prisma.user.findUnique({
            where: { id: notification.userId },
            include: { student: true },
        });
        if (user?.email) {
            await this.mailService.sendNotificationEmail(user.email, notification.title, notification.message, notification.type);
        }
    }
    async sendSMSNotification(notification) {
        if (!notification.userId)
            return;
        const user = await this.prisma.user.findUnique({
            where: { id: notification.userId },
            include: { student: true },
        });
        if (user?.student?.phone) {
            console.log('SMS notification sent to:', user.student.phone);
        }
    }
    async getUserNotifications(userId, page = 1, limit = 20, unreadOnly = false) {
        const where = { userId };
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
    async markAsRead(notificationId, userId) {
        await this.prisma.notification.updateMany({
            where: {
                id: notificationId,
                userId,
            },
            data: {
                isRead: true,
            },
        });
    }
    async markAllAsRead(userId) {
        await this.prisma.notification.updateMany({
            where: {
                userId,
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });
    }
    async deleteNotification(notificationId, userId) {
        await this.prisma.notification.deleteMany({
            where: {
                id: notificationId,
                userId,
            },
        });
    }
    async getNotificationStats(userId) {
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
    async sendBulkNotifications(userIds, data) {
        const notifications = userIds.map(userId => ({
            ...data,
            userId,
        }));
        await this.prisma.notification.createMany({
            data: notifications,
        });
        for (const notification of notifications) {
            await this.sendRealTimeNotification(notification);
        }
    }
    async sendApplicationStatusNotification(applicationId, status, studentId) {
        const application = await this.prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                student: { include: { user: true } },
                scholarship: true,
            },
        });
        if (!application)
            return;
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
    async sendPaymentNotification(paymentId, status, amount, studentId) {
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
        if (!payment)
            return;
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
    async sendDocumentRequestNotification(applicationId, documentType, studentId) {
        const application = await this.prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                student: { include: { user: true } },
                scholarship: true,
            },
        });
        if (!application)
            return;
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
    async sendDeadlineReminder(applicationId, deadline, studentId) {
        const application = await this.prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                student: { include: { user: true } },
                scholarship: true,
            },
        });
        if (!application)
            return;
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
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map