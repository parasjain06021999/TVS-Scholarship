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
exports.ApplicationsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const applications_service_1 = require("./applications.service");
const create_application_dto_1 = require("./dto/create-application.dto");
const review_application_dto_1 = require("./dto/review-application.dto");
let ApplicationsController = class ApplicationsController {
    constructor(applicationsService) {
        this.applicationsService = applicationsService;
    }
    async findAll(req, query) {
        try {
            const { page = 1, limit = 10, status, scholarshipId } = query;
            console.log('Fetching applications for user:', req.user.id, 'role:', req.user.role);
            let result;
            if (req.user.role === 'STUDENT') {
                result = await this.applicationsService.findByStudent(req.user.id, { page, limit, status });
            }
            else {
                result = await this.applicationsService.findAll({ page, limit, status, scholarshipId });
            }
            console.log('Applications result:', result);
            return {
                success: true,
                message: 'Applications retrieved successfully',
                data: result
            };
        }
        catch (error) {
            console.error('Error fetching applications:', error);
            throw error;
        }
    }
    async create(createApplicationDto, req) {
        try {
            console.log('=== APPLICATION CREATION REQUEST ===');
            console.log('Request body:', JSON.stringify(createApplicationDto, null, 2));
            console.log('User from request:', req.user);
            console.log('User ID:', req.user?.id);
            if (!req.user || !req.user.id) {
                throw new Error('User not authenticated or user ID missing');
            }
            if (!createApplicationDto.scholarshipId) {
                throw new Error('Scholarship ID is required');
            }
            const application = await this.applicationsService.create(createApplicationDto, req.user.id);
            console.log('Application created successfully:', application.id);
            return {
                success: true,
                message: 'Application submitted successfully',
                applicationId: application.id,
                data: application
            };
        }
        catch (error) {
            console.error('=== APPLICATION CREATION ERROR ===');
            console.error('Error details:', error);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            if (error.message && error.message.includes('Application already exists')) {
                return {
                    success: false,
                    message: 'You have already applied for this scholarship',
                    error: 'DUPLICATE_APPLICATION',
                    details: error.message
                };
            }
            if (error.code === 'P2002') {
                return {
                    success: false,
                    message: 'You have already applied for this scholarship',
                    error: 'DUPLICATE_APPLICATION',
                    details: 'Unique constraint failed - application already exists'
                };
            }
            return {
                success: false,
                message: error.message || 'Failed to create application',
                error: error.message,
                details: error.stack
            };
        }
    }
    async findOne(req, id) {
        try {
            console.log('Fetching application details for ID:', id);
            const application = await this.applicationsService.findOne(id);
            console.log('Application found:', application ? 'Yes' : 'No');
            return application;
        }
        catch (error) {
            console.error('Error fetching application details:', error);
            throw error;
        }
    }
    async review(id, reviewApplicationDto, req) {
        return this.applicationsService.review(id, reviewApplicationDto);
    }
    async approve(id, req) {
        return this.applicationsService.approveApplication(id, 'Approved by admin');
    }
    async reject(id, body, req) {
        return this.applicationsService.rejectApplication(id, body.rejectionReason || 'Rejected by admin');
    }
    async getStats(req) {
        return this.applicationsService.getStats();
    }
    async sendFeedback(id, body, req) {
        try {
            console.log('Feedback sent for application:', id);
            console.log('Feedback type:', body.type);
            console.log('Feedback message:', body.message);
            console.log('Sent by:', req.user.id);
            return {
                success: true,
                message: 'Feedback sent successfully',
                data: {
                    applicationId: id,
                    type: body.type,
                    message: body.message,
                    sentBy: req.user.id,
                    sentAt: new Date().toISOString(),
                }
            };
        }
        catch (error) {
            console.error('Error sending feedback:', error);
            return {
                success: false,
                message: error.message || 'Failed to send feedback',
            };
        }
    }
};
exports.ApplicationsController = ApplicationsController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_application_dto_1.CreateApplicationDto, Object]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)(':id/review'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, review_application_dto_1.ReviewApplicationDto, Object]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "review", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)(':id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "approve", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)(':id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "reject", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('stats/overview'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "getStats", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)(':id/feedback'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "sendFeedback", null);
exports.ApplicationsController = ApplicationsController = __decorate([
    (0, common_1.Controller)('applications'),
    __metadata("design:paramtypes", [applications_service_1.ApplicationsService])
], ApplicationsController);
//# sourceMappingURL=applications.controller.js.map