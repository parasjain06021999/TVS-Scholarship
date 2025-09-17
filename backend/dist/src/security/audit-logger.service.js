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
exports.AuditLoggerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AuditLoggerService = class AuditLoggerService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createAuditLog(auditData, userId) {
        try {
            const auditLog = await this.prisma.auditLog.create({
                data: {
                    userId,
                    action: auditData.action,
                    ipAddress: auditData.ipAddress,
                    userAgent: auditData.userAgent,
                    sessionId: auditData.sessionId,
                    riskLevel: auditData.riskLevel || 'LOW',
                    outcome: auditData.outcome || 'SUCCESS',
                },
            });
            return {
                success: true,
                message: 'Audit log created successfully',
                data: auditLog,
            };
        }
        catch (error) {
            throw new Error(`Failed to create audit log: ${error.message}`);
        }
    }
    async getAuditLogs(user) {
        try {
            const where = {};
            if (user.role !== 'ADMIN') {
                where.userId = user.id;
            }
            const auditLogs = await this.prisma.auditLog.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: 100,
            });
            return {
                success: true,
                data: auditLogs,
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch audit logs: ${error.message}`);
        }
    }
    async logUserAction(userId, action, resource, resourceId, details = {}, ipAddress, userAgent) {
        try {
            await this.createAuditLog({
                action,
                resource,
                resourceId,
                details,
                ipAddress,
                userAgent,
                sessionId: details.sessionId,
                riskLevel: this.assessRiskLevel(action, details),
                outcome: 'SUCCESS',
            }, userId);
        }
        catch (error) {
            console.error('Failed to log user action:', error);
        }
    }
    assessRiskLevel(action, details) {
        const highRiskActions = ['DELETE', 'UPDATE_PASSWORD', 'CHANGE_ROLE', 'DISBURSE_PAYMENT'];
        const mediumRiskActions = ['UPDATE', 'CREATE', 'LOGIN', 'LOGOUT'];
        if (highRiskActions.some(riskAction => action.includes(riskAction))) {
            return 'HIGH';
        }
        if (mediumRiskActions.some(riskAction => action.includes(riskAction))) {
            return 'MEDIUM';
        }
        return 'LOW';
    }
};
exports.AuditLoggerService = AuditLoggerService;
exports.AuditLoggerService = AuditLoggerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditLoggerService);
//# sourceMappingURL=audit-logger.service.js.map