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
exports.StudentsController = void 0;
const common_1 = require("@nestjs/common");
const students_service_1 = require("./students.service");
const create_student_dto_1 = require("./dto/create-student.dto");
const update_student_dto_1 = require("./dto/update-student.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
let StudentsController = class StudentsController {
    constructor(studentsService) {
        this.studentsService = studentsService;
    }
    async create(createStudentDto) {
        try {
            const student = await this.studentsService.create(createStudentDto);
            return {
                success: true,
                message: 'Student created successfully',
                data: student,
            };
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.HttpException({
                    success: false,
                    message: 'Student with this email already exists',
                }, common_1.HttpStatus.CONFLICT);
            }
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to create student',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getProfile(req) {
        try {
            console.log('Profile request - User:', req.user);
            const student = await this.studentsService.findOne(req.user.id, req.user.id, req.user.role);
            if (!student) {
                throw new common_1.HttpException({
                    success: false,
                    message: 'Student profile not found',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            console.log('Profile response:', { success: true, data: student });
            return {
                success: true,
                message: 'Student profile retrieved successfully',
                data: student,
            };
        }
        catch (error) {
            console.log('Profile error:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to retrieve student profile',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAll(page = 1, limit = 10, search, state, isVerified) {
        try {
            const result = await this.studentsService.findAll({
                page,
                limit,
                search,
                state,
                isVerified,
            });
            return {
                success: true,
                message: 'Students retrieved successfully',
                data: result,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to retrieve students',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id, req) {
        try {
            const student = await this.studentsService.findOne(id, req.user.id, req.user.role);
            if (!student) {
                throw new common_1.HttpException({
                    success: false,
                    message: 'Student not found',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            return {
                success: true,
                message: 'Student retrieved successfully',
                data: student,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to retrieve student',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, updateStudentDto, req) {
        try {
            const student = await this.studentsService.update(id, updateStudentDto, req.user.id, req.user.role);
            if (!student) {
                throw new common_1.HttpException({
                    success: false,
                    message: 'Student not found',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            return {
                success: true,
                message: 'Student updated successfully',
                data: student,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to update student',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async remove(id) {
        try {
            const result = await this.studentsService.remove(id);
            if (!result) {
                throw new common_1.HttpException({
                    success: false,
                    message: 'Student not found',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            return {
                success: true,
                message: 'Student deleted successfully',
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to delete student',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getApplications(id) {
        try {
            const applications = await this.studentsService.getApplications(id);
            return {
                success: true,
                message: 'Student applications retrieved successfully',
                data: applications,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to retrieve student applications',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getDocuments(id) {
        try {
            const documents = await this.studentsService.getDocuments(id);
            return {
                success: true,
                message: 'Student documents retrieved successfully',
                data: documents,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to retrieve student documents',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async verifyStudent(id, req) {
        try {
            const student = await this.studentsService.verifyStudent(id, req.user.role);
            if (!student) {
                throw new common_1.HttpException({
                    success: false,
                    message: 'Student not found',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            return {
                success: true,
                message: 'Student verified successfully',
                data: student,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to verify student',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.StudentsController = StudentsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new student' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Student created successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        email: { type: 'string' },
                        phone: { type: 'string' },
                        isVerified: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                errors: { type: 'array', items: { type: 'string' } },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Conflict - student already exists',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_student_dto_1.CreateStudentDto]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current student profile' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student profile retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        email: { type: 'string' },
                        phone: { type: 'string' },
                        dateOfBirth: { type: 'string', format: 'date' },
                        gender: { type: 'string' },
                        address: { type: 'string' },
                        city: { type: 'string' },
                        state: { type: 'string' },
                        pincode: { type: 'string' },
                        isVerified: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student profile not found',
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all students with pagination and filters' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String, description: 'Search term' }),
    (0, swagger_1.ApiQuery)({ name: 'state', required: false, type: String, description: 'Filter by state' }),
    (0, swagger_1.ApiQuery)({ name: 'isVerified', required: false, type: Boolean, description: 'Filter by verification status' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Students retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: {
                    type: 'object',
                    properties: {
                        students: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    firstName: { type: 'string' },
                                    lastName: { type: 'string' },
                                    email: { type: 'string' },
                                    phone: { type: 'string' },
                                    city: { type: 'string' },
                                    state: { type: 'string' },
                                    isVerified: { type: 'boolean' },
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
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('state')),
    __param(4, (0, common_1.Query)('isVerified')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, Boolean]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get student by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Student ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        email: { type: 'string' },
                        phone: { type: 'string' },
                        dateOfBirth: { type: 'string', format: 'date' },
                        gender: { type: 'string' },
                        address: { type: 'string' },
                        city: { type: 'string' },
                        state: { type: 'string' },
                        pincode: { type: 'string' },
                        aadharNumber: { type: 'string' },
                        panNumber: { type: 'string' },
                        fatherName: { type: 'string' },
                        fatherOccupation: { type: 'string' },
                        motherName: { type: 'string' },
                        motherOccupation: { type: 'string' },
                        familyIncome: { type: 'number' },
                        emergencyContact: { type: 'string' },
                        isVerified: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update student information' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Student ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student updated successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        email: { type: 'string' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_student_dto_1.UpdateStudentDto, Object]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete student (Admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Student ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student deleted successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Admin access required',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/applications'),
    (0, swagger_1.ApiOperation)({ summary: 'Get student applications' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Student ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student applications retrieved successfully',
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
                            status: { type: 'string' },
                            scholarship: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    title: { type: 'string' },
                                    amount: { type: 'number' },
                                },
                            },
                            submittedAt: { type: 'string', format: 'date-time' },
                            reviewedAt: { type: 'string', format: 'date-time' },
                            approvedAt: { type: 'string', format: 'date-time' },
                        },
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "getApplications", null);
__decorate([
    (0, common_1.Get)(':id/documents'),
    (0, swagger_1.ApiOperation)({ summary: 'Get student documents' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Student ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student documents retrieved successfully',
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
                            type: { type: 'string' },
                            fileName: { type: 'string' },
                            originalName: { type: 'string' },
                            fileSize: { type: 'number' },
                            mimeType: { type: 'string' },
                            isVerified: { type: 'boolean' },
                            uploadedAt: { type: 'string', format: 'date-time' },
                        },
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "getDocuments", null);
__decorate([
    (0, common_1.Post)(':id/verify'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.REVIEWER),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Verify student profile (Admin/Reviewer only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Student ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student verified successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        isVerified: { type: 'boolean' },
                        verifiedAt: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "verifyStudent", null);
exports.StudentsController = StudentsController = __decorate([
    (0, swagger_1.ApiTags)('Students'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('students'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [students_service_1.StudentsService])
], StudentsController);
//# sourceMappingURL=students.controller.js.map