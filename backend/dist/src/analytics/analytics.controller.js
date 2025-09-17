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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const analytics_service_1 = require("./analytics.service");
let AnalyticsController = class AnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getStateDistribution(req, query) {
        return this.analyticsService.getStateDistribution(query);
    }
    async getDistrictDistribution(req, query) {
        return this.analyticsService.getDistrictDistribution(query);
    }
    async getGenderDistribution(req, query) {
        return this.analyticsService.getGenderDistribution(query);
    }
    async getClassDistribution(req, query) {
        return this.analyticsService.getClassDistribution(query);
    }
    async getDegreeDistribution(req, query) {
        return this.analyticsService.getDegreeDistribution(query);
    }
    async getOccupationDistribution(req, query) {
        return this.analyticsService.getOccupationDistribution(query);
    }
    async getIncomeDistribution(req, query) {
        return this.analyticsService.getIncomeDistribution(query);
    }
    async getInstituteDistribution(req, query) {
        return this.analyticsService.getInstituteDistribution(query);
    }
    async getAnalyticsOverview(req, query) {
        try {
            const data = await this.analyticsService.getAnalyticsOverview(query);
            return {
                success: true,
                data,
                message: 'Analytics data retrieved successfully'
            };
        }
        catch (error) {
            console.error('Error in analytics overview:', error);
            return {
                success: false,
                data: null,
                message: 'Failed to retrieve analytics data',
                error: error.message
            };
        }
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('distribution/state'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getStateDistribution", null);
__decorate([
    (0, common_1.Get)('distribution/district'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDistrictDistribution", null);
__decorate([
    (0, common_1.Get)('distribution/gender'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getGenderDistribution", null);
__decorate([
    (0, common_1.Get)('distribution/class'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getClassDistribution", null);
__decorate([
    (0, common_1.Get)('distribution/degree'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDegreeDistribution", null);
__decorate([
    (0, common_1.Get)('distribution/occupation'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getOccupationDistribution", null);
__decorate([
    (0, common_1.Get)('distribution/income'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getIncomeDistribution", null);
__decorate([
    (0, common_1.Get)('distribution/institute'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getInstituteDistribution", null);
__decorate([
    (0, common_1.Get)('overview'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getAnalyticsOverview", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, common_1.Controller)('analytics'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map