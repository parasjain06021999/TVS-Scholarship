import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
export declare class CommunicationsService {
    private prisma;
    private mailService;
    constructor(prisma: PrismaService, mailService: MailService);
    createCampaign(campaignData: any, userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            title: string;
            content: string;
            type: import(".prisma/client").$Enums.CommunicationType;
            priority: import(".prisma/client").$Enums.CommunicationPriority;
            targetAudience: import("@prisma/client/runtime/library").JsonValue;
            scheduledAt: Date | null;
            templateId: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            status: import(".prisma/client").$Enums.CommunicationStatus;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    getCampaigns(query: any, user: any): Promise<{
        success: boolean;
        data: {
            id: string;
            title: string;
            content: string;
            type: import(".prisma/client").$Enums.CommunicationType;
            priority: import(".prisma/client").$Enums.CommunicationPriority;
            targetAudience: import("@prisma/client/runtime/library").JsonValue;
            scheduledAt: Date | null;
            templateId: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            status: import(".prisma/client").$Enums.CommunicationStatus;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    getCampaign(id: string, user: any): Promise<{
        success: boolean;
        data: {
            id: string;
            title: string;
            content: string;
            type: import(".prisma/client").$Enums.CommunicationType;
            priority: import(".prisma/client").$Enums.CommunicationPriority;
            targetAudience: import("@prisma/client/runtime/library").JsonValue;
            scheduledAt: Date | null;
            templateId: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            status: import(".prisma/client").$Enums.CommunicationStatus;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    sendCampaign(id: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getCampaignStats(id: string, user: any): Promise<{
        success: boolean;
        data: {
            totalSent: number;
            delivered: number;
            opened: number;
            clicked: number;
            bounced: number;
            unsubscribed: number;
        };
    }>;
    sendEmail(emailData: any, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    sendSMS(smsData: any, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
