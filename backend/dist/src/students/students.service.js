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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let StudentsService = class StudentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createStudentDto) {
        return {
            id: 'mock-student-id',
            ...createStudentDto,
            createdAt: new Date(),
        };
    }
    async findAll(filters) {
        const { page, limit, search, state, isVerified } = filters;
        const where = {};
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (state) {
            where.state = state;
        }
        if (isVerified !== undefined) {
            where.isVerified = isVerified;
        }
        const skip = (page - 1) * limit;
        const [students, total] = await Promise.all([
            this.prisma.student.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            email: true,
                            isActive: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.student.count({ where }),
        ]);
        return {
            data: students,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async remove(id) {
        const student = await this.prisma.student.findUnique({
            where: { id },
        });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        return this.prisma.student.delete({
            where: { id },
        });
    }
    async getApplications(studentId) {
        return this.prisma.application.findMany({
            where: { studentId },
            include: {
                scholarship: {
                    select: {
                        title: true,
                        amount: true,
                        category: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getDocuments(studentId) {
        return this.prisma.document.findMany({
            where: { studentId },
            orderBy: { uploadedAt: 'desc' },
        });
    }
    async findOne(id, userId, userRole) {
        if (userRole === client_1.UserRole.STUDENT && id !== userId) {
            throw new common_1.ForbiddenException('You can only view your own profile');
        }
        console.log('Finding student with ID:', id, 'User ID:', userId, 'Role:', userRole);
        const student = await this.prisma.student.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        isActive: true,
                        createdAt: true,
                    },
                },
                applications: {
                    include: {
                        scholarship: {
                            select: {
                                id: true,
                                title: true,
                                amount: true,
                                category: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                documents: {
                    orderBy: { uploadedAt: 'desc' },
                },
            },
        });
        console.log('Student found:', student ? 'Yes' : 'No', student ? { id: student.id, firstName: student.firstName, lastName: student.lastName } : null);
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        return student;
    }
    async update(id, updateStudentDto, userId, userRole) {
        if (userRole === client_1.UserRole.STUDENT && id !== userId) {
            throw new common_1.ForbiddenException('You can only update your own profile');
        }
        const student = await this.prisma.student.findUnique({
            where: { id },
        });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        return this.prisma.student.update({
            where: { id },
            data: updateStudentDto,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        isActive: true,
                    },
                },
            },
        });
    }
    async getStudentStats(userId) {
        const student = await this.prisma.student.findUnique({
            where: { userId },
            include: {
                applications: {
                    include: {
                        scholarship: true,
                    },
                },
                documents: true,
            },
        });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const stats = {
            totalApplications: student.applications.length,
            approvedApplications: student.applications.filter(app => app.status === 'APPROVED').length,
            pendingApplications: student.applications.filter(app => app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW').length,
            rejectedApplications: student.applications.filter(app => app.status === 'REJECTED').length,
            totalDocuments: student.documents.length,
            verifiedDocuments: student.documents.filter(doc => doc.isVerified).length,
            totalAwardedAmount: student.applications
                .filter(app => app.status === 'APPROVED')
                .reduce((sum, app) => sum + (app.awardedAmount || 0), 0),
        };
        return stats;
    }
    async verifyStudent(id, userRole) {
        if (userRole !== client_1.UserRole.ADMIN && userRole !== client_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException('Only admins can verify students');
        }
        return this.prisma.student.update({
            where: { id },
            data: { isVerified: true },
        });
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudentsService);
//# sourceMappingURL=students.service.js.map