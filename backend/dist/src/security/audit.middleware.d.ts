import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuditLoggerService } from './audit-logger.service';
export declare class AuditMiddleware implements NestMiddleware {
    private auditLogger;
    constructor(auditLogger: AuditLoggerService);
    use(req: Request, res: Response, next: NextFunction): void;
    private determineAction;
    private determineResource;
    private determineRiskLevel;
    private sanitizeRequestBody;
    private sanitizeHeaders;
}
export declare function createAuditMiddleware(auditLogger: AuditLoggerService): (req: Request, res: Response, next: NextFunction) => void;
