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
exports.GdprController = void 0;
const common_1 = require("@nestjs/common");
const gdpr_service_1 = require("./gdpr.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
let GdprController = class GdprController {
    constructor(gdprService) {
        this.gdprService = gdprService;
    }
    async recordConsent(consentData, ipAddress, userAgent) {
        try {
            const { dataTypes, purpose, reason } = consentData;
            await this.gdprService.recordConsent('current-user-id', dataTypes, purpose, ipAddress, userAgent);
            return {
                success: true,
                message: 'Consent recorded successfully',
                data: {
                    dataTypes,
                    purpose,
                    recordedAt: new Date(),
                },
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to record consent',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async withdrawConsent(withdrawalData) {
        try {
            const { dataTypes, reason } = withdrawalData;
            await this.gdprService.withdrawConsent('current-user-id', dataTypes, reason);
            return {
                success: true,
                message: 'Consent withdrawn successfully',
                data: {
                    dataTypes,
                    reason,
                    withdrawnAt: new Date(),
                },
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to withdraw consent',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async exportUserData() {
        try {
            const userData = await this.gdprService.exportUserData('current-user-id');
            return {
                success: true,
                message: 'User data exported successfully',
                data: userData,
            };
        }
        catch (error) {
            if (error.message === 'User not found') {
                throw new common_1.HttpException({
                    success: false,
                    message: 'User not found',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to export user data',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteUserData(deletionData) {
        try {
            const { reason, confirmDeletion } = deletionData;
            if (!confirmDeletion) {
                throw new Error('Deletion confirmation required');
            }
            await this.gdprService.deleteUserData('current-user-id', reason);
            return {
                success: true,
                message: 'User data deleted successfully',
                data: {
                    reason,
                    deletedAt: new Date(),
                },
            };
        }
        catch (error) {
            if (error.message.includes('active applications')) {
                throw new common_1.HttpException({
                    success: false,
                    message: 'Cannot delete user data while active applications exist',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to delete user data',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async rectifyUserData(rectificationData) {
        try {
            const { dataType, newValue, reason } = rectificationData;
            await this.gdprService.rectifyUserData('current-user-id', dataType, newValue, reason);
            return {
                success: true,
                message: 'User data rectified successfully',
                data: {
                    dataType,
                    newValue,
                    reason,
                    rectifiedAt: new Date(),
                },
            };
        }
        catch (error) {
            if (error.message.includes('Invalid data type')) {
                throw new common_1.HttpException({
                    success: false,
                    message: 'Invalid data type',
                    error: error.message,
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to rectify user data',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getDataProcessingActivities() {
        try {
            const activities = await this.gdprService.getDataProcessingActivities();
            return {
                success: true,
                message: 'Data processing activities retrieved successfully',
                data: activities,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to retrieve data processing activities',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async checkRetentionCompliance() {
        try {
            const compliance = await this.gdprService.checkRetentionCompliance();
            return {
                success: true,
                message: 'Retention compliance checked successfully',
                data: compliance,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to check retention compliance',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getPrivacyPolicy() {
        try {
            const privacyPolicy = {
                version: '1.0',
                lastUpdated: '2024-01-01',
                dataController: 'TVS Group',
                contactEmail: 'privacy@tvsgroup.com',
                dataProcessingPurposes: [
                    'Scholarship processing and management',
                    'Payment processing and disbursement',
                    'Communication and notifications',
                    'Identity verification and fraud prevention',
                    'Compliance with legal obligations',
                ],
                dataCategories: [
                    'Personal identification data',
                    'Contact information',
                    'Financial information',
                    'Academic records',
                    'Documentation',
                ],
                legalBasis: [
                    'Contract performance',
                    'Legal obligation',
                    'Consent',
                    'Legitimate interest',
                ],
                dataRetention: '7 years from last interaction',
                userRights: [
                    'Right to access',
                    'Right to rectification',
                    'Right to erasure',
                    'Right to restrict processing',
                    'Right to data portability',
                    'Right to object',
                ],
                dataTransfers: [
                    'Educational institutions',
                    'Banking partners',
                    'Government agencies (as required)',
                ],
                securityMeasures: [
                    'Encryption at rest and in transit',
                    'Access controls and authentication',
                    'Regular security audits',
                    'Data minimization',
                    'Privacy by design',
                ],
            };
            return {
                success: true,
                message: 'Privacy policy retrieved successfully',
                data: privacyPolicy,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to retrieve privacy policy',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.GdprController = GdprController;
__decorate([
    (0, common_1.Post)('consent'),
    (0, swagger_1.ApiOperation)({ summary: 'Record user consent for data processing' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Consent recorded successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Body)('ipAddress')),
    __param(2, (0, common_1.Body)('userAgent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], GdprController.prototype, "recordConsent", null);
__decorate([
    (0, common_1.Post)('consent/withdraw'),
    (0, swagger_1.ApiOperation)({ summary: 'Withdraw user consent' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Consent withdrawn successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GdprController.prototype, "withdrawConsent", null);
__decorate([
    (0, common_1.Get)('data-export'),
    (0, swagger_1.ApiOperation)({ summary: 'Export user data (Right to Access)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User data exported successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'User not found',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GdprController.prototype, "exportUserData", null);
__decorate([
    (0, common_1.Delete)('data-deletion'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete user data (Right to Erasure)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User data deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - cannot delete data',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GdprController.prototype, "deleteUserData", null);
__decorate([
    (0, common_1.Post)('data-rectification'),
    (0, swagger_1.ApiOperation)({ summary: 'Rectify user data (Right to Rectification)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User data rectified successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GdprController.prototype, "rectifyUserData", null);
__decorate([
    (0, common_1.Get)('data-processing-activities'),
    (0, swagger_1.ApiOperation)({ summary: 'Get data processing activities' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Data processing activities retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GdprController.prototype, "getDataProcessingActivities", null);
__decorate([
    (0, common_1.Get)('retention-compliance'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Check data retention compliance (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Retention compliance checked successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Admin access required',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GdprController.prototype, "checkRetentionCompliance", null);
__decorate([
    (0, common_1.Get)('privacy-policy'),
    (0, swagger_1.ApiOperation)({ summary: 'Get privacy policy information' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Privacy policy retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GdprController.prototype, "getPrivacyPolicy", null);
exports.GdprController = GdprController = __decorate([
    (0, swagger_1.ApiTags)('GDPR Compliance'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('gdpr'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [gdpr_service_1.GdprService])
], GdprController);
//# sourceMappingURL=gdpr.controller.js.map