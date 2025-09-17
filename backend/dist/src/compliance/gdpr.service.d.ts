import { PrismaService } from '../prisma/prisma.service';
export declare class GdprService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserConsent(userId: string, requestingUser: any): Promise<{
        success: boolean;
        data: {
            id: string;
            userId: string;
            status: import(".prisma/client").$Enums.ConsentStatus;
            ipAddress: string;
            userAgent: string;
            dataTypes: string[];
            purpose: string;
            grantedAt: Date;
            withdrawnAt: Date | null;
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
    updateUserConsent(consentData: any, userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            userId: string;
            status: import(".prisma/client").$Enums.ConsentStatus;
            ipAddress: string;
            userAgent: string;
            dataTypes: string[];
            purpose: string;
            grantedAt: Date;
            withdrawnAt: Date | null;
            consentVersion: string;
            withdrawalReason: string | null;
        };
    }>;
    exportUserData(userId: string, requestingUser: any): Promise<{
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
    deleteUserData(userId: string, requestingUser: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getGdprAuditTrail(requestingUser: any): Promise<{
        success: boolean;
        data: ({
            user: {
                email: string;
                id: string;
                role: import(".prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string | null;
            action: string;
            entity: string;
            entityId: string | null;
            oldValues: import("@prisma/client/runtime/library").JsonValue | null;
            newValues: import("@prisma/client/runtime/library").JsonValue | null;
            ipAddress: string | null;
            userAgent: string | null;
            sessionId: string | null;
            riskLevel: string | null;
            outcome: string | null;
        })[];
    }>;
    requestUserConsent(consentRequest: any, requestedBy: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            userId: string;
            status: import(".prisma/client").$Enums.ConsentStatus;
            ipAddress: string;
            userAgent: string;
            dataTypes: string[];
            purpose: string;
            grantedAt: Date;
            withdrawnAt: Date | null;
            consentVersion: string;
            withdrawalReason: string | null;
        };
    }>;
}
