import { PrismaService } from '../prisma/prisma.service';
export declare class AuditLoggerService {
    private prisma;
    constructor(prisma: PrismaService);
    createAuditLog(auditData: any, userId: string): Promise<{
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
    getAuditLogs(user: any): Promise<{
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
    logUserAction(userId: string, action: string, resource: string, resourceId: string, details?: any, ipAddress?: string, userAgent?: string): Promise<void>;
    private assessRiskLevel;
}
