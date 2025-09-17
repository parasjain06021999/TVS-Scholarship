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
exports.AuditMiddleware = void 0;
exports.createAuditMiddleware = createAuditMiddleware;
const common_1 = require("@nestjs/common");
const audit_logger_service_1 = require("./audit-logger.service");
let AuditMiddleware = class AuditMiddleware {
    constructor(auditLogger) {
        this.auditLogger = auditLogger;
    }
    use(req, res, next) {
        const originalSend = res.send;
        const startTime = Date.now();
        const userId = req.user?.id || 'anonymous';
        const userRole = req.user?.role || 'none';
        const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
        const userAgent = req.get('User-Agent') || 'unknown';
        res.send = function (data) {
            const duration = Date.now() - startTime;
            const outcome = res.statusCode < 400 ? 'success' : 'failure';
            const action = this.determineAction(req.method, req.route?.path);
            const resource = this.determineResource(req.route?.path);
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
            this.auditLogger.log(auditEntry).catch(error => {
                console.error('Failed to log audit entry:', error);
            });
            originalSend.call(this, data);
        }.bind(this);
        next();
    }
    determineAction(method, path) {
        const actionMap = {
            GET: 'read',
            POST: 'create',
            PUT: 'update',
            PATCH: 'update',
            DELETE: 'delete',
        };
        const baseAction = actionMap[method] || 'unknown';
        if (path?.includes('/auth/login'))
            return 'auth.login';
        if (path?.includes('/auth/logout'))
            return 'auth.logout';
        if (path?.includes('/auth/register'))
            return 'auth.register';
        if (path?.includes('/auth/forgot-password'))
            return 'auth.forgot_password';
        if (path?.includes('/auth/reset-password'))
            return 'auth.reset_password';
        if (path?.includes('/payments/process'))
            return 'payment.process';
        if (path?.includes('/applications/approve'))
            return 'application.approve';
        if (path?.includes('/applications/reject'))
            return 'application.reject';
        if (path?.includes('/documents/upload'))
            return 'document.upload';
        if (path?.includes('/documents/verify'))
            return 'document.verify';
        if (path?.includes('/export'))
            return 'data.export';
        if (path?.includes('/backup'))
            return 'system.backup';
        return baseAction;
    }
    determineResource(path) {
        if (!path)
            return 'unknown';
        if (path.includes('/auth'))
            return 'authentication';
        if (path.includes('/users'))
            return 'user';
        if (path.includes('/students'))
            return 'student';
        if (path.includes('/applications'))
            return 'application';
        if (path.includes('/scholarships'))
            return 'scholarship';
        if (path.includes('/payments'))
            return 'payment';
        if (path.includes('/documents'))
            return 'document';
        if (path.includes('/communications'))
            return 'communication';
        if (path.includes('/analytics'))
            return 'analytics';
        if (path.includes('/admin'))
            return 'admin';
        if (path.includes('/system'))
            return 'system';
        return 'unknown';
    }
    determineRiskLevel(action, outcome) {
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
    sanitizeRequestBody(body) {
        if (!body)
            return null;
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
    sanitizeHeaders(headers) {
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
};
exports.AuditMiddleware = AuditMiddleware;
exports.AuditMiddleware = AuditMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_logger_service_1.AuditLoggerService])
], AuditMiddleware);
function createAuditMiddleware(auditLogger) {
    return (req, res, next) => {
        const middleware = new AuditMiddleware(auditLogger);
        middleware.use(req, res, next);
    };
}
//# sourceMappingURL=audit.middleware.js.map