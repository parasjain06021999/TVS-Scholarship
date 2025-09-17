import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(req: any, query: any): Promise<{
        notifications: {
            title: string;
            priority: string | null;
            id: string;
            createdAt: Date;
            userId: string;
            data: import("@prisma/client/runtime/library").JsonValue | null;
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
    create(createNotificationDto: CreateNotificationDto, req: any): Promise<any>;
    getUnreadCount(req: any): Promise<{
        unread: number;
    }>;
    markAsRead(id: string, req: any): Promise<void>;
    markAllAsRead(req: any): Promise<void>;
}
