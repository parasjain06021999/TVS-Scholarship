import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessControlService } from './access-control.service';
import { AuditLoggerService } from './audit-logger.service';
export declare class PermissionGuard implements CanActivate {
    private reflector;
    private accessControl;
    private auditLogger;
    constructor(reflector: Reflector, accessControl: AccessControlService, auditLogger: AuditLoggerService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractResourceFromPath;
    private extractActionFromMethod;
}
export declare const RequirePermission: (resource: string, action: string) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare const RequireResource: (resource: string) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare const RequireAction: (action: string) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
