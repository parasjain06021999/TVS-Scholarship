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
exports.CommunicationsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const communications_service_1 = require("./communications.service");
const swagger_1 = require("@nestjs/swagger");
let CommunicationsController = class CommunicationsController {
    constructor(communicationsService) {
        this.communicationsService = communicationsService;
    }
    async createCampaign(body, req) {
        return this.communicationsService.createCampaign(body, req.user.id);
    }
    async getCampaigns(query, req) {
        return this.communicationsService.getCampaigns(query, req.user);
    }
    async getCampaign(id, req) {
        return this.communicationsService.getCampaign(id, req.user);
    }
    async sendCampaign(id, req) {
        return this.communicationsService.sendCampaign(id, req.user.id);
    }
    async getCampaignStats(id, req) {
        return this.communicationsService.getCampaignStats(id, req.user);
    }
    async sendEmail(body, req) {
        return this.communicationsService.sendEmail(body, req.user.id);
    }
    async sendSMS(body, req) {
        return this.communicationsService.sendSMS(body, req.user.id);
    }
};
exports.CommunicationsController = CommunicationsController;
__decorate([
    (0, common_1.Post)('campaigns'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new communication campaign' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Campaign created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CommunicationsController.prototype, "createCampaign", null);
__decorate([
    (0, common_1.Get)('campaigns'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all campaigns' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Campaigns retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CommunicationsController.prototype, "getCampaigns", null);
__decorate([
    (0, common_1.Get)('campaigns/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get campaign by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Campaign retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CommunicationsController.prototype, "getCampaign", null);
__decorate([
    (0, common_1.Post)('campaigns/:id/send'),
    (0, swagger_1.ApiOperation)({ summary: 'Send campaign' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Campaign sent successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CommunicationsController.prototype, "sendCampaign", null);
__decorate([
    (0, common_1.Get)('campaigns/:id/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get campaign statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Campaign stats retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CommunicationsController.prototype, "getCampaignStats", null);
__decorate([
    (0, common_1.Post)('send-email'),
    (0, swagger_1.ApiOperation)({ summary: 'Send individual email' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Email sent successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CommunicationsController.prototype, "sendEmail", null);
__decorate([
    (0, common_1.Post)('send-sms'),
    (0, swagger_1.ApiOperation)({ summary: 'Send individual SMS' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'SMS sent successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CommunicationsController.prototype, "sendSMS", null);
exports.CommunicationsController = CommunicationsController = __decorate([
    (0, swagger_1.ApiTags)('Communications'),
    (0, common_1.Controller)('communications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [communications_service_1.CommunicationsService])
], CommunicationsController);
//# sourceMappingURL=communications.controller.js.map