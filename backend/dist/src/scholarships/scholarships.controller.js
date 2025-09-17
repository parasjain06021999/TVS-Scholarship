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
exports.ScholarshipsController = void 0;
const common_1 = require("@nestjs/common");
const scholarships_service_1 = require("./scholarships.service");
const create_scholarship_dto_1 = require("./dto/create-scholarship.dto");
const update_scholarship_dto_1 = require("./dto/update-scholarship.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
let ScholarshipsController = class ScholarshipsController {
    constructor(scholarshipsService) {
        this.scholarshipsService = scholarshipsService;
    }
    async create(createScholarshipDto, req) {
        try {
            const scholarship = await this.scholarshipsService.create(createScholarshipDto, req.user.id);
            return {
                success: true,
                message: 'Scholarship created successfully',
                data: scholarship,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to create scholarship',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAll(page = 1, limit = 10, category, isActive, search, minAmount, maxAmount) {
        try {
            const result = await this.scholarshipsService.findAll({
                page,
                limit,
                category,
                isActive,
                search,
                minAmount,
                maxAmount,
            });
            return {
                success: true,
                message: 'Scholarships retrieved successfully',
                data: result,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to retrieve scholarships',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findActive() {
        try {
            const scholarships = await this.scholarshipsService.findActive();
            return {
                success: true,
                message: 'Active scholarships retrieved successfully',
                data: scholarships,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to retrieve active scholarships',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            const scholarship = await this.scholarshipsService.findOne(id);
            if (!scholarship) {
                throw new common_1.HttpException({
                    success: false,
                    message: 'Scholarship not found',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            return {
                success: true,
                message: 'Scholarship retrieved successfully',
                data: scholarship,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to retrieve scholarship',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, updateScholarshipDto) {
        try {
            const scholarship = await this.scholarshipsService.update(id, updateScholarshipDto);
            if (!scholarship) {
                throw new common_1.HttpException({
                    success: false,
                    message: 'Scholarship not found',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            return {
                success: true,
                message: 'Scholarship updated successfully',
                data: scholarship,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to update scholarship',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async remove(id) {
        try {
            const result = await this.scholarshipsService.remove(id);
            if (!result) {
                throw new common_1.HttpException({
                    success: false,
                    message: 'Scholarship not found',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            return {
                success: true,
                message: 'Scholarship deleted successfully',
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to delete scholarship',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getApplications(id, page = 1, limit = 10, status) {
        try {
            const result = await this.scholarshipsService.getApplications(id, {
                page,
                limit,
                status,
            });
            return {
                success: true,
                message: 'Scholarship applications retrieved successfully',
                data: result,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to retrieve scholarship applications',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getStats() {
        try {
            const stats = await this.scholarshipsService.getStats();
            return {
                success: true,
                message: 'Statistics retrieved successfully',
                data: stats,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to retrieve statistics',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async checkEligibility(eligibilityData) {
        try {
            const result = await this.scholarshipsService.checkEligibility(eligibilityData);
            return {
                success: true,
                message: 'Eligibility checked successfully',
                data: result,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to check eligibility',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async toggleStatus(id) {
        try {
            const scholarship = await this.scholarshipsService.toggleStatus(id);
            if (!scholarship) {
                throw new common_1.HttpException({
                    success: false,
                    message: 'Scholarship not found',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            return {
                success: true,
                message: `Scholarship ${scholarship.isActive ? 'activated' : 'deactivated'} successfully`,
                data: scholarship,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to toggle scholarship status',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ScholarshipsController = ScholarshipsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new scholarship (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Scholarship created successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        amount: { type: 'number' },
                        category: { type: 'string' },
                        isActive: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Admin access required',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_scholarship_dto_1.CreateScholarshipDto, Object]),
    __metadata("design:returntype", Promise)
], ScholarshipsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all scholarships with pagination and filters' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, type: String, description: 'Filter by category' }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String, description: 'Search term' }),
    (0, swagger_1.ApiQuery)({ name: 'minAmount', required: false, type: Number, description: 'Minimum amount filter' }),
    (0, swagger_1.ApiQuery)({ name: 'maxAmount', required: false, type: Number, description: 'Maximum amount filter' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Scholarships retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: {
                    type: 'object',
                    properties: {
                        scholarships: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    title: { type: 'string' },
                                    description: { type: 'string' },
                                    amount: { type: 'number' },
                                    maxAmount: { type: 'number' },
                                    category: { type: 'string' },
                                    subCategory: { type: 'string' },
                                    applicationStartDate: { type: 'string', format: 'date-time' },
                                    applicationEndDate: { type: 'string', format: 'date-time' },
                                    academicYear: { type: 'string' },
                                    isActive: { type: 'boolean' },
                                    maxApplications: { type: 'number' },
                                    currentApplications: { type: 'number' },
                                    createdAt: { type: 'string', format: 'date-time' },
                                },
                            },
                        },
                        pagination: {
                            type: 'object',
                            properties: {
                                page: { type: 'number' },
                                limit: { type: 'number' },
                                total: { type: 'number' },
                                totalPages: { type: 'number' },
                                hasNext: { type: 'boolean' },
                                hasPrev: { type: 'boolean' },
                            },
                        },
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('category')),
    __param(3, (0, common_1.Query)('isActive')),
    __param(4, (0, common_1.Query)('search')),
    __param(5, (0, common_1.Query)('minAmount')),
    __param(6, (0, common_1.Query)('maxAmount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Boolean, String, Number, Number]),
    __metadata("design:returntype", Promise)
], ScholarshipsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active scholarships' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Active scholarships retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            title: { type: 'string' },
                            description: { type: 'string' },
                            amount: { type: 'number' },
                            category: { type: 'string' },
                            applicationEndDate: { type: 'string', format: 'date-time' },
                            isActive: { type: 'boolean' },
                        },
                    },
                },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScholarshipsController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get scholarship by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Scholarship ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Scholarship retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        eligibilityCriteria: { type: 'string' },
                        amount: { type: 'number' },
                        maxAmount: { type: 'number' },
                        minAmount: { type: 'number' },
                        category: { type: 'string' },
                        subCategory: { type: 'string' },
                        applicationStartDate: { type: 'string', format: 'date-time' },
                        applicationEndDate: { type: 'string', format: 'date-time' },
                        academicYear: { type: 'string' },
                        isActive: { type: 'boolean' },
                        maxApplications: { type: 'number' },
                        currentApplications: { type: 'number' },
                        requirements: { type: 'object' },
                        documentsRequired: { type: 'array', items: { type: 'string' } },
                        priority: { type: 'number' },
                        createdBy: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Scholarship not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScholarshipsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update scholarship (Admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Scholarship ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Scholarship updated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Scholarship not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Admin access required',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_scholarship_dto_1.UpdateScholarshipDto]),
    __metadata("design:returntype", Promise)
], ScholarshipsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete scholarship (Admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Scholarship ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Scholarship deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Scholarship not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Admin access required',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScholarshipsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/applications'),
    (0, swagger_1.ApiOperation)({ summary: 'Get applications for a specific scholarship' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Scholarship ID' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, type: String, description: 'Filter by status' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Scholarship applications retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String]),
    __metadata("design:returntype", Promise)
], ScholarshipsController.prototype, "getApplications", null);
__decorate([
    (0, common_1.Get)('stats/overview'),
    (0, swagger_1.ApiOperation)({ summary: 'Get scholarship statistics overview' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: {
                    type: 'object',
                    properties: {
                        total: { type: 'number' },
                        active: { type: 'number' },
                        inactive: { type: 'number' },
                        totalApplications: { type: 'number' },
                        totalAmount: { type: 'number' },
                        averageAmount: { type: 'number' },
                        categoryBreakdown: {
                            type: 'object',
                            additionalProperties: { type: 'number' },
                        },
                    },
                },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScholarshipsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)('check-eligibility'),
    (0, swagger_1.ApiOperation)({ summary: 'Check student eligibility for scholarships' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Eligibility checked successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: {
                    type: 'object',
                    properties: {
                        eligibleScholarships: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    title: { type: 'string' },
                                    amount: { type: 'number' },
                                    eligibilityScore: { type: 'number' },
                                    reasons: { type: 'array', items: { type: 'string' } },
                                },
                            },
                        },
                        ineligibleScholarships: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    title: { type: 'string' },
                                    reasons: { type: 'array', items: { type: 'string' } },
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScholarshipsController.prototype, "checkEligibility", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-status'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle scholarship active status (Admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Scholarship ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Scholarship status toggled successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Scholarship not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Admin access required',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScholarshipsController.prototype, "toggleStatus", null);
exports.ScholarshipsController = ScholarshipsController = __decorate([
    (0, swagger_1.ApiTags)('Scholarships'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('scholarships'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [scholarships_service_1.ScholarshipsService])
], ScholarshipsController);
//# sourceMappingURL=scholarships.controller.js.map