import { GdprService } from './gdpr.service';
export declare class ComplianceController {
    private readonly gdprService;
    constructor(gdprService: GdprService);
    getUserConsent(userId: string, req: any): Promise<{
        success: boolean;
        data: {
            id: string;
            status: import(".prisma/client").$Enums.ConsentStatus;
            userId: string;
            dataTypes: string[];
            purpose: string;
            grantedAt: Date;
            withdrawnAt: Date | null;
            ipAddress: string;
            userAgent: string;
            consentVersion: string;
            withdrawalReason: string | null;
        } | {
            userId: string;
            status: "PENDING";
            consentGiven: boolean;
            consentDate: any;
            consentVersion: string;
        };
    }>;
    updateUserConsent(body: any, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            status: import(".prisma/client").$Enums.ConsentStatus;
            userId: string;
            dataTypes: string[];
            purpose: string;
            grantedAt: Date;
            withdrawnAt: Date | null;
            ipAddress: string;
            userAgent: string;
            consentVersion: string;
            withdrawalReason: string | null;
        };
    }>;
    exportUserData(userId: string, req: any): Promise<{
        success: boolean;
        data: {
            personalInfo: {
                id: string;
                email: string;
                role: import(".prisma/client").$Enums.UserRole;
                isActive: boolean;
                createdAt: Date;
            };
            studentProfile: {
                firstName: string;
                lastName: string;
                dateOfBirth: Date;
                gender: import(".prisma/client").$Enums.Gender;
                phone: string;
                address: string;
            };
            exportedAt: string;
        };
    }>;
    deleteUserData(userId: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getGdprAuditTrail(req: any): Promise<{
        success: boolean;
        data: ({
            user: {
                id: string;
                email: string;
                role: import(".prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string | null;
            ipAddress: string | null;
            userAgent: string | null;
            action: string;
            entity: string;
            entityId: string | null;
            oldValues: import("@prisma/client/runtime/library").JsonValue | null;
            newValues: import("@prisma/client/runtime/library").JsonValue | null;
            sessionId: string | null;
            riskLevel: string | null;
            outcome: string | null;
        })[];
    }>;
    requestUserConsent(body: any, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            status: import(".prisma/client").$Enums.ConsentStatus;
            userId: string;
            dataTypes: string[];
            purpose: string;
            grantedAt: Date;
            withdrawnAt: Date | null;
            ipAddress: string;
            userAgent: string;
            consentVersion: string;
            withdrawalReason: string | null;
        };
    }>;
}
