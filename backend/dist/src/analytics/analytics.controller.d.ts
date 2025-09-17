import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getStateDistribution(req: any, query: any): Promise<{
        state: string;
        count: number;
    }[]>;
    getDistrictDistribution(req: any, query: any): Promise<{
        district: string;
        count: number;
    }[]>;
    getGenderDistribution(req: any, query: any): Promise<{
        gender: string;
        count: number;
    }[]>;
    getClassDistribution(req: any, query: any): Promise<{
        class: string;
        count: number;
    }[]>;
    getDegreeDistribution(req: any, query: any): Promise<{
        degree: string;
        count: number;
    }[]>;
    getOccupationDistribution(req: any, query: any): Promise<{
        occupation: string;
        count: number;
    }[]>;
    getIncomeDistribution(req: any, query: any): Promise<{
        incomeRange: string;
        count: number;
    }[]>;
    getInstituteDistribution(req: any, query: any): Promise<{
        type: string;
        count: number;
    }[]>;
    getAnalyticsOverview(req: any, query: any): Promise<{
        success: boolean;
        data: {
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
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        data: any;
        message: string;
        error: any;
    }>;
}
