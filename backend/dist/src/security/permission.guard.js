"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireAction = exports.RequireResource = exports.RequirePermission = exports.PermissionGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const access_control_service_1 = require("./access-control.service");
const audit_logger_service_1 = require("./audit-logger.service");
let PermissionGuard = class PermissionGuard {
    constructor(reflector, accessControl, auditLogger) {
        this.reflector = reflector;
        this.accessControl = accessControl;
        this.auditLogger = auditLogger;
    }
    async canActivate(context) {
        const requiredPermission = this.reflector.get('permission', context.getHandler());
        const requiredResource = this.reflector.get('resource', context.getHandler());
        const requiredAction = this.reflector.get('action', context.getHandler());
        if (!requiredPermission && !requiredResource && !requiredAction) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException('Authentication required');
        }
        const { role, id: userId } = user;
        const resource = requiredResource || this.extractResourceFromPath(request.url);
        const action = requiredAction || this.extractActionFromMethod(request.method);
        const hasPermission = this.accessControl.hasPermission(role, resource, action);
        if (!hasPermission) {
            await this.auditLogger.log({
                timestamp: new Date(),
                userId,
                userRole: role,
                action: `access.denied.${action}`,
                resource,
                resourceId: request.params?.id,
                ipAddress: request.ip,
                userAgent: request.get('User-Agent'),
                outcome: 'failure',
                details: {
                    requiredPermission: requiredPermission,
                    requiredResource: resource,
                    requiredAction: action,
                    userRole: role,
                },
                risk_level: 'high',
            });
            throw new common_1.ForbiddenException(`Access denied. Required: ${resource}:${action}, User role: ${role}`);
        }
        await this.auditLogger.log({
            timestamp: new Date(),
            userId,
            userRole: role,
            action: `access.granted.${action}`,
            resource,
            resourceId: request.params?.id,
            ipAddress: request.ip,
            userAgent: request.get('User-Agent'),
            outcome: 'success',
            risk_level: 'low',
        });
        return true;
    }
    extractResourceFromPath(url) {
        const pathSegments = url.split('/').filter(segment => segment);
        if (pathSegments[0] === 'api') {
            pathSegments.shift();
        }
        const resource = pathSegments[0];
        const resourceMap = {
            'auth': 'authentication',
            'users': 'user',
            'students': 'student',
            'applications': 'application',
            'scholarships': 'scholarship',
            'payments': 'payment',
            'documents': 'document',
            'communications': 'communication',
            'analytics': 'analytics',
            'admin': 'admin',
            'system': 'system',
        };
        return resourceMap[resource] || resource;
    }
    extractActionFromMethod(method) {
        const actionMap = {
            'GET': 'read',
            'POST': 'create',
            'PUT': 'update',
            'PATCH': 'update',
            'DELETE': 'delete',
        };
        return actionMap[method] || 'unknown';
    }
};
exports.PermissionGuard = PermissionGuard;
exports.PermissionGuard = PermissionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        access_control_service_1.AccessControlService,
        audit_logger_service_1.AuditLoggerService])
], PermissionGuard);
const RequirePermission = (resource, action) => {
    return (target, propertyKey, descriptor) => {
        Reflect.defineMetadata('resource', resource, descriptor.value);
        Reflect.defineMetadata('action', action, descriptor.value);
        return descriptor;
    };
};
exports.RequirePermission = RequirePermission;
const RequireResource = (resource) => {
    return (target, propertyKey, descriptor) => {
        Reflect.defineMetadata('resource', resource, descriptor.value);
        return descriptor;
    };
};
exports.RequireResource = RequireResource;
const RequireAction = (action) => {
    return (target, propertyKey, descriptor) => {
        Reflect.defineMetadata('action', action, descriptor.value);
        return descriptor;
    };
};
exports.RequireAction = RequireAction;
//# sourceMappingURL=permission.guard.js.map