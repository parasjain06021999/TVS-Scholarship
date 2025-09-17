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
exports.ScholarshipsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ScholarshipsService = class ScholarshipsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createScholarshipDto, createdBy) {
        const { applicationStartDate, applicationEndDate, ...data } = createScholarshipDto;
        const startDate = new Date(applicationStartDate);
        const endDate = new Date(applicationEndDate);
        if (startDate >= endDate) {
            throw new common_1.BadRequestException('Application end date must be after start date');
        }
        if (startDate < new Date()) {
            throw new common_1.BadRequestException('Application start date cannot be in the past');
        }
        return this.prisma.scholarship.create({
            data: {
                ...data,
                applicationStartDate: startDate,
                applicationEndDate: endDate,
                createdBy,
            },
        });
    }
    async findAll(filters) {
        const { page, limit, search, category, isActive, minAmount, maxAmount } = filters;
        const where = {};
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { subCategory: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (category) {
            where.category = category;
        }
        if (isActive !== undefined) {
            where.isActive = isActive;
        }
        return this.prisma.paginate('scholarship', page, limit, where);
    }
    async findOne(id) {
        const scholarship = await this.prisma.scholarship.findUnique({
            where: { id },
            include: {
                applications: {
                    include: {
                        student: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
        if (!scholarship) {
            throw new common_1.NotFoundException('Scholarship not found');
        }
        return scholarship;
    }
    async update(id, updateScholarshipDto) {
        const scholarship = await this.prisma.scholarship.findUnique({
            where: { id },
        });
        if (!scholarship) {
            throw new common_1.NotFoundException('Scholarship not found');
        }
        const { applicationStartDate, applicationEndDate, ...data } = updateScholarshipDto;
        if (applicationStartDate && applicationEndDate) {
            const startDate = new Date(applicationStartDate);
            const endDate = new Date(applicationEndDate);
            if (startDate >= endDate) {
                throw new common_1.BadRequestException('Application end date must be after start date');
            }
        }
        return this.prisma.scholarship.update({
            where: { id },
            data: {
                ...data,
                ...(applicationStartDate && { applicationStartDate: new Date(applicationStartDate) }),
                ...(applicationEndDate && { applicationEndDate: new Date(applicationEndDate) }),
            },
        });
    }
    async remove(id) {
        const scholarship = await this.prisma.scholarship.findUnique({
            where: { id },
            include: {
                applications: true,
            },
        });
        if (!scholarship) {
            throw new common_1.NotFoundException('Scholarship not found');
        }
        if (scholarship.applications.length > 0) {
            throw new common_1.BadRequestException('Cannot delete scholarship with existing applications');
        }
        return this.prisma.scholarship.delete({
            where: { id },
        });
    }
    async getEligibleScholarships(studentId) {
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            include: {
                applications: {
                    select: {
                        scholarshipId: true,
                        status: true,
                    },
                },
            },
        });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const appliedScholarshipIds = student.applications.map(app => app.scholarshipId);
        const scholarships = await this.prisma.scholarship.findMany({
            where: {
                isActive: true,
                applicationEndDate: {
                    gte: new Date(),
                },
                id: {
                    notIn: appliedScholarshipIds,
                },
            },
            orderBy: [
                { priority: 'desc' },
                { createdAt: 'desc' },
            ],
        });
        return scholarships;
    }
    async getScholarshipStats(id) {
        const scholarship = await this.prisma.scholarship.findUnique({
            where: { id },
            include: {
                applications: true,
            },
        });
        if (!scholarship) {
            throw new common_1.NotFoundException('Scholarship not found');
        }
        const stats = {
            totalApplications: scholarship.applications.length,
            approvedApplications: scholarship.applications.filter(app => app.status === 'APPROVED').length,
            pendingApplications: scholarship.applications.filter(app => app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW').length,
            rejectedApplications: scholarship.applications.filter(app => app.status === 'REJECTED').length,
            totalAwardedAmount: scholarship.applications
                .filter(app => app.status === 'APPROVED')
                .reduce((sum, app) => sum + (app.awardedAmount || 0), 0),
            remainingApplications: scholarship.maxApplications ? scholarship.maxApplications - scholarship.applications.length : null,
        };
        return stats;
    }
    async toggleActive(id) {
        const scholarship = await this.prisma.scholarship.findUnique({
            where: { id },
        });
        if (!scholarship) {
            throw new common_1.NotFoundException('Scholarship not found');
        }
        return this.prisma.scholarship.update({
            where: { id },
            data: { isActive: !scholarship.isActive },
        });
    }
    async toggleStatus(id) {
        const scholarship = await this.prisma.scholarship.findUnique({
            where: { id },
        });
        if (!scholarship) {
            throw new common_1.NotFoundException('Scholarship not found');
        }
        return this.prisma.scholarship.update({
            where: { id },
            data: { isActive: !scholarship.isActive },
        });
    }
    async findActive() {
        return this.prisma.scholarship.findMany({
            where: {
                isActive: true,
                applicationEndDate: { gte: new Date() },
            },
            orderBy: { priority: 'desc' },
        });
    }
    async getApplications(scholarshipId, filters) {
        const { page = 1, limit = 10, status } = filters;
        const where = { scholarshipId };
        if (status) {
            where.status = status;
        }
        const skip = (page - 1) * limit;
        const [applications, total] = await Promise.all([
            this.prisma.application.findMany({
                where,
                skip,
                take: limit,
                include: {
                    student: {
                        select: {
                            firstName: true,
                            lastName: true,
                            phone: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.application.count({ where }),
        ]);
        return {
            data: applications,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async getStats() {
        const [total, active, applications, totalAmount] = await Promise.all([
            this.prisma.scholarship.count(),
            this.prisma.scholarship.count({ where: { isActive: true } }),
            this.prisma.application.count(),
            this.prisma.scholarship.aggregate({
                _sum: { amount: true },
            }),
        ]);
        return {
            total,
            active,
            applications,
            totalAmount: totalAmount._sum.amount || 0,
        };
    }
    async checkEligibility(eligibilityData) {
        return {
            eligible: true,
            reasons: [],
            suggestedScholarships: [],
        };
    }
};
exports.ScholarshipsService = ScholarshipsService;
exports.ScholarshipsService = ScholarshipsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ScholarshipsService);
//# sourceMappingURL=scholarships.service.js.map