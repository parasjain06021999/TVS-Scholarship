import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuditLoggerService } from './audit-logger.service';

@Injectable()
export class AuditMiddleware implements NestMiddleware {
  constructor(private auditLogger: AuditLoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const originalSend = res.send;
    const startTime = Date.now();

    // Extract user information from request
    const userId = (req as any).user?.id || 'anonymous';
    const userRole = (req as any).user?.role || 'none';
    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';

    // Override res.send to capture response details
    res.send = function (data) {
      const duration = Date.now() - startTime;
      const outcome = res.statusCode < 400 ? 'success' : 'failure';

      // Determine action and resource from request
      const action = this.determineAction(req.method, req.route?.path);
      const resource = this.determineResource(req.route?.path);

      // Create audit entry
      const auditEntry = {
        timestamp: new Date(),
        userId,
        userRole,
        action,
        resource,
        resourceId: req.params?.id,
        ipAddress,
        userAgent,
        outcome,
        details: {
          method: req.method,
          url: req.originalUrl,
          statusCode: res.statusCode,
          duration,
          requestBody: this.sanitizeRequestBody(req.body),
          queryParams: req.query,
          headers: this.sanitizeHeaders(req.headers),
        },
        risk_level: this.determineRiskLevel(action, outcome),
      };

      // Log audit entry asynchronously
      this.auditLogger.log(auditEntry).catch(error => {
        console.error('Failed to log audit entry:', error);
      });

      // Call original send
      originalSend.call(this, data);
    }.bind(this);

    next();
  }

  private determineAction(method: string, path?: string): string {
    const actionMap = {
      GET: 'read',
      POST: 'create',
      PUT: 'update',
      PATCH: 'update',
      DELETE: 'delete',
    };

    const baseAction = actionMap[method] || 'unknown';

    // Add specific action based on path
    if (path?.includes('/auth/login')) return 'auth.login';
    if (path?.includes('/auth/logout')) return 'auth.logout';
    if (path?.includes('/auth/register')) return 'auth.register';
    if (path?.includes('/auth/forgot-password')) return 'auth.forgot_password';
    if (path?.includes('/auth/reset-password')) return 'auth.reset_password';
    if (path?.includes('/payments/process')) return 'payment.process';
    if (path?.includes('/applications/approve')) return 'application.approve';
    if (path?.includes('/applications/reject')) return 'application.reject';
    if (path?.includes('/documents/upload')) return 'document.upload';
    if (path?.includes('/documents/verify')) return 'document.verify';
    if (path?.includes('/export')) return 'data.export';
    if (path?.includes('/backup')) return 'system.backup';

    return baseAction;
  }

  private determineResource(path?: string): string {
    if (!path) return 'unknown';

    if (path.includes('/auth')) return 'authentication';
    if (path.includes('/users')) return 'user';
    if (path.includes('/students')) return 'student';
    if (path.includes('/applications')) return 'application';
    if (path.includes('/scholarships')) return 'scholarship';
    if (path.includes('/payments')) return 'payment';
    if (path.includes('/documents')) return 'document';
    if (path.includes('/communications')) return 'communication';
    if (path.includes('/analytics')) return 'analytics';
    if (path.includes('/admin')) return 'admin';
    if (path.includes('/system')) return 'system';

    return 'unknown';
  }

  private determineRiskLevel(action: string, outcome: string): 'low' | 'medium' | 'high' {
    const highRiskActions = [
      'auth.login_failed',
      'payment.process',
      'application.approve',
      'application.reject',
      'data.export',
      'system.backup',
      'document.upload',
    ];

    if (highRiskActions.includes(action)) {
      return 'high';
    }

    if (outcome === 'failure' && action.includes('auth')) {
      return 'high';
    }

    if (action.includes('delete') || action.includes('export')) {
      return 'medium';
    }

    return 'low';
  }

  private sanitizeRequestBody(body: any): any {
    if (!body) return null;

    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'key',
      'aadhaarNumber',
      'accountNumber',
      'bankDetails',
      'ssn',
      'creditCard',
    ];

    const sanitized = { ...body };

    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  private sanitizeHeaders(headers: any): any {
    const sensitiveHeaders = [
      'authorization',
      'cookie',
      'x-api-key',
      'x-auth-token',
    ];

    const sanitized = { ...headers };

    sensitiveHeaders.forEach(header => {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    });

    return sanitized;
  }
}

// Factory function for creating audit middleware
export function createAuditMiddleware(auditLogger: AuditLoggerService) {
  return (req: Request, res: Response, next: NextFunction) => {
    const middleware = new AuditMiddleware(auditLogger);
    middleware.use(req, res, next);
  };
}
