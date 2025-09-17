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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const access_control_service_1 = require("./access-control.service");
const audit_logger_service_1 = require("./audit-logger.service");
const encryption_service_1 = require("./encryption.service");
const swagger_1 = require("@nestjs/swagger");
let SecurityController = class SecurityController {
    constructor(accessControlService, auditLoggerService, encryptionService) {
        this.accessControlService = accessControlService;
        this.auditLoggerService = auditLoggerService;
        this.encryptionService = encryptionService;
    }
    async getUserPermissions(req) {
        return this.accessControlService.getUserPermissions(req.user.id);
    }
    async createAuditLog(body, req) {
        return this.auditLoggerService.createAuditLog(body, req.user.id);
    }
    async getAuditLogs(req) {
        return this.auditLoggerService.getAuditLogs(req.user);
    }
    async encryptData(body, req) {
        const encrypted = await this.encryptionService.encrypt(body.data);
        return {
            success: true,
            data: { encrypted },
        };
    }
    async decryptData(body, req) {
        const decrypted = await this.encryptionService.decrypt(body.encrypted);
        return {
            success: true,
            data: { decrypted },
        };
    }
};
exports.SecurityController = SecurityController;
__decorate([
    (0, common_1.Get)('permissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user permissions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Permissions retrieved successfully' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "getUserPermissions", null);
__decorate([
    (0, common_1.Post)('audit-logs'),
    (0, swagger_1.ApiOperation)({ summary: 'Create audit log entry' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Audit log created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "createAuditLog", null);
__decorate([
    (0, common_1.Get)('audit-logs'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit logs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Audit logs retrieved successfully' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "getAuditLogs", null);
__decorate([
    (0, common_1.Post)('encrypt'),
    (0, swagger_1.ApiOperation)({ summary: 'Encrypt data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data encrypted successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "encryptData", null);
__decorate([
    (0, common_1.Post)('decrypt'),
    (0, swagger_1.ApiOperation)({ summary: 'Decrypt data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data decrypted successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "decryptData", null);
exports.SecurityController = SecurityController = __decorate([
    (0, swagger_1.ApiTags)('Security'),
    (0, common_1.Controller)('security'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [access_control_service_1.AccessControlService,
        audit_logger_service_1.AuditLoggerService,
        encryption_service_1.EncryptionService])
], SecurityController);
//# sourceMappingURL=security.controller.js.map