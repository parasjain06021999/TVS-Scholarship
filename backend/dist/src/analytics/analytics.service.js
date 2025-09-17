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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStateDistribution(filters) {
        const applications = await this.getApplicationsWithFilters(filters);
        const stateCount = {};
        applications.forEach(app => {
            const state = app.student?.state || 'Unknown';
            stateCount[state] = (stateCount[state] || 0) + 1;
        });
        return Object.entries(stateCount).map(([state, count]) => ({ state, count }));
    }
    async getDistrictDistribution(filters) {
        const applications = await this.getApplicationsWithFilters(filters);
        const districtCount = {};
        applications.forEach(app => {
            const district = app.student?.city || 'Unknown';
            districtCount[district] = (districtCount[district] || 0) + 1;
        });
        return Object.entries(districtCount).map(([district, count]) => ({ district, count }));
    }
    async getGenderDistribution(filters) {
        const applications = await this.getApplicationsWithFilters(filters);
        const genderCount = {};
        applications.forEach(app => {
            const applicationData = app.applicationData;
            const gender = applicationData?.personalInfo?.gender || 'Unknown';
            genderCount[gender] = (genderCount[gender] || 0) + 1;
        });
        return Object.entries(genderCount).map(([gender, count]) => ({ gender, count }));
    }
    async getClassDistribution(filters) {
        const applications = await this.getApplicationsWithFilters(filters);
        const classCount = {};
        applications.forEach(app => {
            const applicationData = app.applicationData;
            const currentYear = applicationData?.educationInfo?.currentYear;
            const classType = currentYear ? `Year ${currentYear}` : 'Unknown';
            classCount[classType] = (classCount[classType] || 0) + 1;
        });
        return Object.entries(classCount).map(([classType, count]) => ({ class: classType, count }));
    }
    async getDegreeDistribution(filters) {
        const applications = await this.getApplicationsWithFilters(filters);
        const degreeCount = {};
        applications.forEach(app => {
            const applicationData = app.applicationData;
            const course = applicationData?.educationInfo?.currentCourse || 'Unknown';
            degreeCount[course] = (degreeCount[course] || 0) + 1;
        });
        return Object.entries(degreeCount).map(([degree, count]) => ({ degree, count }));
    }
    async getOccupationDistribution(filters) {
        const applications = await this.getApplicationsWithFilters(filters);
        const occupationCount = {};
        applications.forEach(app => {
            const applicationData = app.applicationData;
            const occupation = applicationData?.familyInfo?.fatherOccupation || 'Unknown';
            occupationCount[occupation] = (occupationCount[occupation] || 0) + 1;
        });
        return Object.entries(occupationCount).map(([occupation, count]) => ({ occupation, count }));
    }
    async getIncomeDistribution(filters) {
        const applications = await this.getApplicationsWithFilters(filters);
        const incomeCount = {};
        applications.forEach(app => {
            const applicationData = app.applicationData;
            const income = applicationData?.familyInfo?.fatherIncome || 0;
            const incomeRange = this.getIncomeRange(income);
            incomeCount[incomeRange] = (incomeCount[incomeRange] || 0) + 1;
        });
        return Object.entries(incomeCount).map(([incomeRange, count]) => ({ incomeRange, count }));
    }
    async getInstituteDistribution(filters) {
        const applications = await this.getApplicationsWithFilters(filters);
        const instituteCount = {};
        applications.forEach(app => {
            const applicationData = app.applicationData;
            const institute = applicationData?.educationInfo?.currentInstitution || 'Unknown';
            const instituteType = this.getInstituteType(institute);
            instituteCount[instituteType] = (instituteCount[instituteType] || 0) + 1;
        });
        return Object.entries(instituteCount).map(([type, count]) => ({ type, count }));
    }
    async getAnalyticsOverview(filters) {
        const applications = await this.getApplicationsWithFilters(filters);
        return {
            totalApplications: applications.length,
            stateDistribution: await this.getStateDistribution(filters),
            districtDistribution: await this.getDistrictDistribution(filters),
            genderDistribution: await this.getGenderDistribution(filters),
            classDistribution: await this.getClassDistribution(filters),
            degreeDistribution: await this.getDegreeDistribution(filters),
            occupationDistribution: await this.getOccupationDistribution(filters),
            incomeDistribution: await this.getIncomeDistribution(filters),
            instituteDistribution: await this.getInstituteDistribution(filters),
        };
    }
    async getApplicationsWithFilters(filters) {
        try {
            const where = {};
            if (filters?.status) {
                where.status = filters.status;
            }
            const applications = await this.prisma.application.findMany({
                where,
                include: {
                    student: true,
                    scholarship: true,
                },
            });
            return applications || [];
        }
        catch (error) {
            console.error('Error fetching applications for analytics:', error);
            return [];
        }
    }
    getIncomeRange(income) {
        if (income < 100000)
            return '<1 L';
        if (income < 200000)
            return '1L-2L';
        if (income < 300000)
            return '2L-3L';
        if (income < 400000)
            return '3L-4L';
        if (income < 500000)
            return '4L-5L';
        return '>5L';
    }
    getInstituteType(institute) {
        if (institute.toLowerCase().includes('government') || institute.toLowerCase().includes('govt')) {
            return 'Government';
        }
        if (institute.toLowerCase().includes('aided')) {
            return 'Government Aided';
        }
        return 'Private';
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map