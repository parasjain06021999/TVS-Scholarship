import { CommunicationsService } from './communications.service';
export declare class CommunicationsController {
    private readonly communicationsService;
    constructor(communicationsService: CommunicationsService);
    createCampaign(body: any, req: any): Promise<{
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
    getCampaigns(query: any, req: any): Promise<{
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
    getCampaign(id: string, req: any): Promise<{
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
