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
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ApplicationsService = class ApplicationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createApplicationDto, userId) {
        try {
            console.log('Creating application with data:', createApplicationDto);
            console.log('User ID:', userId);
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: { student: true }
            });
            console.log('User found:', user);
            let studentId = userId;
            if (!user.student) {
                console.log('User does not have student record, creating one...');
                const personalInfo = createApplicationDto.personalInfo;
                if (!personalInfo) {
                    throw new Error('Personal information is required to create student record');
                }
                const student = await this.prisma.student.create({
                    data: {
                        userId: userId,
                        firstName: personalInfo.firstName,
                        lastName: personalInfo.lastName,
                        email: personalInfo.email,
                        phone: personalInfo.phone,
                        dateOfBirth: new Date(personalInfo.dateOfBirth),
                        gender: personalInfo.gender,
                        address: createApplicationDto.addressInfo?.currentAddress || '',
                        city: createApplicationDto.addressInfo?.currentCity || '',
                        state: createApplicationDto.addressInfo?.currentState || '',
                        pincode: createApplicationDto.addressInfo?.currentPinCode || '',
                        aadharNumber: personalInfo.aadharNumber,
                        panNumber: personalInfo.panNumber,
                        fatherName: createApplicationDto.familyInfo?.fatherName || '',
                        fatherOccupation: createApplicationDto.familyInfo?.fatherOccupation || '',
                        motherName: createApplicationDto.familyInfo?.motherName || '',
                        motherOccupation: createApplicationDto.familyInfo?.motherOccupation || '',
                        familyIncome: createApplicationDto.familyInfo?.familyIncome || 0,
                        emergencyContact: createApplicationDto.familyInfo?.emergencyContact || '',
                    }
                });
                studentId = student.id;
                console.log('Student record created:', student.id);
            }
            else {
                studentId = user.student.id;
                console.log('Using existing student record:', studentId);
            }
            const applicationId = `APP-${Date.now()}`;
            const applicationData = {
                personalInfo: createApplicationDto.personalInfo,
                addressInfo: createApplicationDto.addressInfo,
                documents: createApplicationDto.documents,
            };
            console.log('Application data to be stored:', applicationData);
            console.log('Using studentId:', studentId);
            const existingApplication = await this.prisma.application.findFirst({
                where: {
                    studentId: studentId,
                    scholarshipId: createApplicationDto.scholarshipId,
                },
            });
            if (existingApplication) {
                throw new Error(`Application already exists for this scholarship. Application ID: ${existingApplication.id}`);
            }
            const result = await this.prisma.application.create({
                data: {
                    id: applicationId,
                    scholarshipId: createApplicationDto.scholarshipId,
                    studentId: studentId,
                    status: 'SUBMITTED',
                    applicationData: applicationData,
                    academicInfo: createApplicationDto.academicInfo,
                    familyInfo: createApplicationDto.familyInfo,
                    financialInfo: createApplicationDto.financialInfo,
                    additionalInfo: createApplicationDto.additionalInfo,
                    submittedAt: new Date(),
                },
                include: {
                    student: true,
                    scholarship: true,
                    documents: true,
                    payments: true,
                },
            });
            console.log('Application created successfully:', result);
            return result;
        }
        catch (error) {
            console.error('Error creating application:', error);
            throw error;
        }
    }
    async findAll(filters) {
        const { page = 1, limit = 10, status, scholarshipId } = filters || {};
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;
        const skip = (pageNum - 1) * limitNum;
        const where = {};
        if (status)
            where.status = status;
        if (scholarshipId)
            where.scholarshipId = scholarshipId;
        const applications = await this.prisma.application.findMany({
            where,
            skip,
            take: limitNum,
            include: {
                student: true,
                scholarship: true,
                documents: true,
                payments: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        const total = await this.prisma.application.count({ where });
        return {
            applications,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
            },
        };
    }
    async findByStudent(userId, filters) {
        const { page = 1, limit = 10, status } = filters || {};
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;
        const skip = (pageNum - 1) * limitNum;
        console.log('Finding applications for user ID:', userId);
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { student: true }
        });
        console.log('User found:', user);
        if (!user || !user.student) {
            console.log('No student record found for user:', userId);
            return {
                applications: [],
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total: 0,
                    totalPages: 0,
                },
            };
        }
        const studentId = user.student.id;
        console.log('Student ID found:', studentId);
        const where = { studentId };
        if (status)
            where.status = status;
        console.log('Query where condition:', where);
        const applications = await this.prisma.application.findMany({
            where,
            skip,
            take: limitNum,
            include: {
                student: true,
                scholarship: true,
                documents: true,
                payments: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        console.log('Applications found:', applications.length);
        const total = await this.prisma.application.count({ where });
        return {
            applications,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
            },
        };
    }
    async findOne(id) {
        const application = await this.prisma.application.findUnique({
            where: { id },
            include: {
                student: true,
                scholarship: true,
                documents: true,
                payments: true,
            },
        });
        if (!application) {
            throw new common_1.NotFoundException('Application not found');
        }
        return application;
    }
    async update(id, updateApplicationDto) {
        return this.prisma.application.update({
            where: { id },
            data: {
                status: updateApplicationDto.status,
                additionalInfo: updateApplicationDto.additionalInfo,
            },
        });
    }
    async review(id, reviewApplicationDto) {
        return this.prisma.application.update({
            where: { id },
            data: {
                status: reviewApplicationDto.status,
                reviewedAt: new Date(),
            },
        });
    }
    async reviewApplication(id, reviewDto) {
        return this.review(id, reviewDto);
    }
    async approveApplication(id, adminNotes) {
        return this.prisma.application.update({
            where: { id },
            data: {
                status: 'APPROVED',
                approvedAt: new Date(),
            },
        });
    }
    async rejectApplication(id, reason, adminNotes) {
        return this.prisma.application.update({
            where: { id },
            data: {
                status: 'REJECTED',
                rejectedAt: new Date(),
                rejectionReason: reason,
                adminNotes: adminNotes,
            },
        });
    }
    async getStats() {
        const total = await this.prisma.application.count();
        const approved = await this.prisma.application.count({
            where: { status: 'APPROVED' },
        });
        const pending = await this.prisma.application.count({
            where: { status: 'PENDING' },
        });
        const rejected = await this.prisma.application.count({
            where: { status: 'REJECTED' },
        });
        const totalAmountDisbursed = await this.prisma.payment.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { amount: true },
        });
        const totalStudents = await this.prisma.student.count();
        const totalScholarships = await this.prisma.scholarship.count();
        return {
            total,
            approved,
            pending,
            rejected,
            totalAmountDisbursed: totalAmountDisbursed._sum.amount || 0,
            totalStudents,
            totalScholarships,
        };
    }
    async bulkActions(bulkActionDto) {
        return { message: 'Bulk actions completed' };
    }
    async remove(id) {
        return this.prisma.application.delete({
            where: { id },
        });
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ApplicationsService);
//# sourceMappingURL=applications.service.js.map