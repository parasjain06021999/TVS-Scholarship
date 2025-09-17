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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const reports_service_1 = require("./reports.service");
const swagger_1 = require("@nestjs/swagger");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async getDashboardStats(query, req) {
        return this.reportsService.getDashboardStats(query, req.user);
    }
    async getApplicationAnalytics(query, req) {
        return this.reportsService.getApplicationAnalytics(query, req.user);
    }
    async getScholarshipAnalytics(query, req) {
        return this.reportsService.getScholarshipAnalytics(query, req.user);
    }
    async getPaymentAnalytics(query, req) {
        return this.reportsService.getPaymentAnalytics(query, req.user);
    }
    async getStudentAnalytics(query, req) {
        return this.reportsService.getStudentAnalytics(query, req.user);
    }
    async exportReport(query, req) {
        return this.reportsService.exportReport(query, req.user);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard stats retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('applications'),
    (0, swagger_1.ApiOperation)({ summary: 'Get application analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Application analytics retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getApplicationAnalytics", null);
__decorate([
    (0, common_1.Get)('scholarships'),
    (0, swagger_1.ApiOperation)({ summary: 'Get scholarship analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Scholarship analytics retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getScholarshipAnalytics", null);
__decorate([
    (0, common_1.Get)('payments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get payment analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment analytics retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getPaymentAnalytics", null);
__decorate([
    (0, common_1.Get)('students'),
    (0, swagger_1.ApiOperation)({ summary: 'Get student analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Student analytics retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getStudentAnalytics", null);
__decorate([
    (0, common_1.Get)('export/:type'),
    (0, swagger_1.ApiOperation)({ summary: 'Export report data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report exported successfully' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportReport", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('Reports'),
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map