import { CommunicationsService } from './communications.service';
export declare class CommunicationsController {
    private readonly communicationsService;
    constructor(communicationsService: CommunicationsService);
    createCampaign(body: any, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            priority: import(".prisma/client").$Enums.CommunicationPriority;
            status: import(".prisma/client").$Enums.CommunicationStatus;
            type: import(".prisma/client").$Enums.CommunicationType;
            content: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            targetAudience: import("@prisma/client/runtime/library").JsonValue;
            scheduledAt: Date | null;
            templateId: string | null;
        };
    }>;
    getCampaigns(query: any, req: any): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            priority: import(".prisma/client").$Enums.CommunicationPriority;
            status: import(".prisma/client").$Enums.CommunicationStatus;
            type: import(".prisma/client").$Enums.CommunicationType;
            content: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            targetAudience: import("@prisma/client/runtime/library").JsonValue;
            scheduledAt: Date | null;
            templateId: string | null;
        }[];
    }>;
    getCampaign(id: string, req: any): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            priority: import(".prisma/client").$Enums.CommunicationPriority;
            status: import(".prisma/client").$Enums.CommunicationStatus;
            type: import(".prisma/client").$Enums.CommunicationType;
            content: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            targetAudience: import("@prisma/client/runtime/library").JsonValue;
            scheduledAt: Date | null;
            templateId: string | null;
        };
    }>;
    sendCampaign(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getCampaignStats(id: string, req: any): Promise<{
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
    sendEmail(body: any, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    sendSMS(body: any, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
