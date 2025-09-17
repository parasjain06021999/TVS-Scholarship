import { Document } from 'mongoose';
export type AuditLogDocument = AuditLog & Document;
export declare class AuditLog {
    userId: string;
    action: string;
    entity: string;
    entityId?: string;
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    requestId?: string;
    duration?: number;
    status: string;
    errorMessage?: string;
    additionalData?: Record<string, any>;
    timestamp: Date;
    module?: string;
    subModule?: string;
    severity?: string;
    tags?: string[];
}
export declare const AuditLogSchema: any;
