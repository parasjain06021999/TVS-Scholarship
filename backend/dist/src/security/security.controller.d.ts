import { AccessControlService } from './access-control.service';
import { AuditLoggerService } from './audit-logger.service';
import { EncryptionService } from './encryption.service';
export declare class SecurityController {
    private readonly accessControlService;
    private readonly auditLoggerService;
    private readonly encryptionService;
    constructor(accessControlService: AccessControlService, auditLoggerService: AuditLoggerService, encryptionService: EncryptionService);
    getUserPermissions(req: any): Promise<{
        success: boolean;
        data: {
            userId: string;
            role: import(".prisma/client").$Enums.UserRole;
            isActive: boolean;
            permissions: any;
        };
    }>;
    createAuditLog(body: any, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
    }>;
    getAuditLogs(req: any): Promise<{
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
    encryptData(body: {
        data: string;
    }, req: any): Promise<{
        success: boolean;
        data: {
            encrypted: string;
        };
    }>;
    decryptData(body: {
        encrypted: string;
    }, req: any): Promise<{
        success: boolean;
        data: {
            decrypted: string;
        };
    }>;
}
