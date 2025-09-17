import { ScholarshipCategory } from '@prisma/client';
export declare class CreateScholarshipDto {
    title: string;
    description: string;
    eligibilityCriteria: string;
    amount: number;
    maxAmount?: number;
    category: ScholarshipCategory;
    subCategory?: string;
    applicationStartDate: string;
    applicationEndDate: string;
    academicYear: string;
    isActive?: boolean;
    maxApplications?: number;
    currentApplications?: number;
    documentsRequired?: string[];
    priority?: number;
}
