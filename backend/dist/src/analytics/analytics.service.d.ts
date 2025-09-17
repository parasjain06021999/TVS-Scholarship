import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getStateDistribution(filters?: any): Promise<{
        state: string;
        count: number;
    }[]>;
    getDistrictDistribution(filters?: any): Promise<{
        district: string;
        count: number;
    }[]>;
    getGenderDistribution(filters?: any): Promise<{
        gender: string;
        count: number;
    }[]>;
    getClassDistribution(filters?: any): Promise<{
        class: string;
        count: number;
    }[]>;
    getDegreeDistribution(filters?: any): Promise<{
        degree: string;
        count: number;
    }[]>;
    getOccupationDistribution(filters?: any): Promise<{
        occupation: string;
        count: number;
    }[]>;
    getIncomeDistribution(filters?: any): Promise<{
        incomeRange: string;
        count: number;
    }[]>;
    getInstituteDistribution(filters?: any): Promise<{
        type: string;
        count: number;
    }[]>;
    getAnalyticsOverview(filters?: any): Promise<{
        totalApplications: number;
        stateDistribution: {
            state: string;
            count: number;
        }[];
        districtDistribution: {
            district: string;
            count: number;
        }[];
        genderDistribution: {
            gender: string;
            count: number;
        }[];
        classDistribution: {
            class: string;
            count: number;
        }[];
        degreeDistribution: {
            degree: string;
            count: number;
        }[];
        occupationDistribution: {
            occupation: string;
            count: number;
        }[];
        incomeDistribution: {
            incomeRange: string;
            count: number;
        }[];
        instituteDistribution: {
            type: string;
            count: number;
        }[];
    }>;
    private getApplicationsWithFilters;
    private getIncomeRange;
    private getInstituteType;
}
