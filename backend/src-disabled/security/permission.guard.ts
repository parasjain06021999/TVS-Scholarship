import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessControlService } from './access-control.service';
import { AuditLoggerService } from './audit-logger.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private accessControl: AccessControlService,
    private auditLogger: AuditLoggerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<string>('permission', context.getHandler());
    const requiredResource = this.reflector.get<string>('resource', context.getHandler());
    const requiredAction = this.reflector.get<string>('action', context.getHandler());

    if (!requiredPermission && !requiredResource && !requiredAction) {
      return true; // No permission required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    const { role, id: userId } = user;
    const resource = requiredResource || this.extractResourceFromPath(request.url);
    const action = requiredAction || this.extractActionFromMethod(request.method);

    // Check permission
    const hasPermission = this.accessControl.hasPermission(role, resource, action);

    if (!hasPermission) {
      // Log unauthorized access attempt
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

      throw new ForbiddenException(
        `Access denied. Required: ${resource}:${action}, User role: ${role}`
      );
    }

    // Log successful access
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

  private extractResourceFromPath(url: string): string {
    const pathSegments = url.split('/').filter(segment => segment);
    
    // Remove API prefix if present
    if (pathSegments[0] === 'api') {
      pathSegments.shift();
    }

    // Extract resource from path
    const resource = pathSegments[0];
    
    // Map common resource names
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

  private extractActionFromMethod(method: string): string {
    const actionMap = {
      'GET': 'read',
      'POST': 'create',
      'PUT': 'update',
      'PATCH': 'update',
      'DELETE': 'delete',
    };

    return actionMap[method] || 'unknown';
  }
}

// Decorator for specifying required permissions
export const RequirePermission = (resource: string, action: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata('resource', resource, descriptor.value);
    Reflect.defineMetadata('action', action, descriptor.value);
    return descriptor;
  };
};

// Decorator for specifying required resource
export const RequireResource = (resource: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata('resource', resource, descriptor.value);
    return descriptor;
  };
};

// Decorator for specifying required action
export const RequireAction = (action: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata('action', action, descriptor.value);
    return descriptor;
  };
};
