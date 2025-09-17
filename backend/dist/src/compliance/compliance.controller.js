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
exports.ComplianceController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const gdpr_service_1 = require("./gdpr.service");
const swagger_1 = require("@nestjs/swagger");
let ComplianceController = class ComplianceController {
    constructor(gdprService) {
        this.gdprService = gdprService;
    }
    async getUserConsent(userId, req) {
        return this.gdprService.getUserConsent(userId, req.user);
    }
    async updateUserConsent(body, req) {
        return this.gdprService.updateUserConsent(body, req.user.id);
    }
    async exportUserData(userId, req) {
        return this.gdprService.exportUserData(userId, req.user);
    }
    async deleteUserData(userId, req) {
        return this.gdprService.deleteUserData(userId, req.user);
    }
    async getGdprAuditTrail(req) {
        return this.gdprService.getGdprAuditTrail(req.user);
    }
    async requestUserConsent(body, req) {
        return this.gdprService.requestUserConsent(body, req.user.id);
    }
};
exports.ComplianceController = ComplianceController;
__decorate([
    (0, common_1.Get)('gdpr/consent/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user consent status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Consent status retrieved successfully' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getUserConsent", null);
__decorate([
    (0, common_1.Post)('gdpr/consent'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user consent' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Consent updated successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "updateUserConsent", null);
__decorate([
    (0, common_1.Post)('gdpr/data-export/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Export user data (GDPR)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User data exported successfully' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "exportUserData", null);
__decorate([
    (0, common_1.Delete)('gdpr/data-deletion/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete user data (GDPR)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User data deleted successfully' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "deleteUserData", null);
__decorate([
    (0, common_1.Get)('gdpr/audit-trail'),
    (0, swagger_1.ApiOperation)({ summary: 'Get GDPR audit trail' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Audit trail retrieved successfully' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getGdprAuditTrail", null);
__decorate([
    (0, common_1.Post)('gdpr/consent-request'),
    (0, swagger_1.ApiOperation)({ summary: 'Request user consent' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Consent request sent successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "requestUserConsent", null);
exports.ComplianceController = ComplianceController = __decorate([
    (0, swagger_1.ApiTags)('Compliance'),
    (0, common_1.Controller)('compliance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [gdpr_service_1.GdprService])
], ComplianceController);
//# sourceMappingURL=compliance.controller.js.map