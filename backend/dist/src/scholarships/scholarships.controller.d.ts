import { ScholarshipsService } from './scholarships.service';
import { CreateScholarshipDto } from './dto/create-scholarship.dto';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto';
export declare class ScholarshipsController {
    private readonly scholarshipsService;
    constructor(scholarshipsService: ScholarshipsService);
    create(createScholarshipDto: CreateScholarshipDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            eligibilityCriteria: string;
            amount: number;
            maxAmount: number | null;
            category: import(".prisma/client").$Enums.ScholarshipCategory;
            subCategory: string | null;
            applicationStartDate: Date;
            applicationEndDate: Date;
            academicYear: string;
            maxApplications: number | null;
            currentApplications: number;
            requirements: import("@prisma/client/runtime/library").JsonValue | null;
            documentsRequired: string[];
            priority: number;
            createdBy: string;
        };
    }>;
    findAll(page?: number, limit?: number, category?: string, isActive?: boolean, search?: string, minAmount?: number, maxAmount?: number): Promise<{
        success: boolean;
        message: string;
        data: {
            data: any;
            meta: {
                total: any;
                page: number;
                limit: number;
                totalPages: number;
            };
        };
    }>;
    findActive(): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            eligibilityCriteria: string;
            amount: number;
            maxAmount: number | null;
            category: import(".prisma/client").$Enums.ScholarshipCategory;
            subCategory: string | null;
            applicationStartDate: Date;
            applicationEndDate: Date;
            academicYear: string;
            maxApplications: number | null;
            currentApplications: number;
            requirements: import("@prisma/client/runtime/library").JsonValue | null;
            documentsRequired: string[];
            priority: number;
            createdBy: string;
        }[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            applications: ({
                student: {
                    email: string;
                    firstName: string;
                    lastName: string;
                    id: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                studentId: string;
                scholarshipId: string;
                status: import(".prisma/client").$Enums.ApplicationStatus;
                applicationData: import("@prisma/client/runtime/library").JsonValue;
                academicInfo: import("@prisma/client/runtime/library").JsonValue | null;
                familyInfo: import("@prisma/client/runtime/library").JsonValue | null;
                financialInfo: import("@prisma/client/runtime/library").JsonValue | null;
                additionalInfo: import("@prisma/client/runtime/library").JsonValue | null;
                reviewerNotes: string | null;
                adminNotes: string | null;
                score: number | null;
                rank: number | null;
                awardedAmount: number | null;
                rejectionReason: string | null;
                remarks: string | null;
                submittedAt: Date | null;
                reviewedAt: Date | null;
                approvedAt: Date | null;
                rejectedAt: Date | null;
            })[];
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            eligibilityCriteria: string;
            amount: number;
            maxAmount: number | null;
            category: import(".prisma/client").$Enums.ScholarshipCategory;
            subCategory: string | null;
            applicationStartDate: Date;
            applicationEndDate: Date;
            academicYear: string;
            maxApplications: number | null;
            currentApplications: number;
            requirements: import("@prisma/client/runtime/library").JsonValue | null;
            documentsRequired: string[];
            priority: number;
            createdBy: string;
        };
    }>;
    update(id: string, updateScholarshipDto: UpdateScholarshipDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            eligibilityCriteria: string;
            amount: number;
            maxAmount: number | null;
            category: import(".prisma/client").$Enums.ScholarshipCategory;
            subCategory: string | null;
            applicationStartDate: Date;
            applicationEndDate: Date;
            academicYear: string;
            maxApplications: number | null;
            currentApplications: number;
            requirements: import("@prisma/client/runtime/library").JsonValue | null;
            documentsRequired: string[];
            priority: number;
            createdBy: string;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getApplications(id: string, page?: number, limit?: number, status?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            data: ({
                student: {
                    firstName: string;
                    lastName: string;
                    phone: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                studentId: string;
                scholarshipId: string;
                status: import(".prisma/client").$Enums.ApplicationStatus;
                applicationData: import("@prisma/client/runtime/library").JsonValue;
                academicInfo: import("@prisma/client/runtime/library").JsonValue | null;
                familyInfo: import("@prisma/client/runtime/library").JsonValue | null;
                financialInfo: import("@prisma/client/runtime/library").JsonValue | null;
                additionalInfo: import("@prisma/client/runtime/library").JsonValue | null;
                reviewerNotes: string | null;
                adminNotes: string | null;
                score: number | null;
                rank: number | null;
                awardedAmount: number | null;
                rejectionReason: string | null;
                remarks: string | null;
                submittedAt: Date | null;
                reviewedAt: Date | null;
                approvedAt: Date | null;
                rejectedAt: Date | null;
            })[];
            pagination: {
                page: any;
                limit: any;
                total: number;
                pages: number;
            };
        };
    }>;
    getStats(): Promise<{
        success: boolean;
        message: string;
        data: {
            total: number;
            active: number;
            applications: number;
            totalAmount: number;
        };
    }>;
    checkEligibility(eligibilityData: any): Promise<{
        success: boolean;
        message: string;
        data: {
            eligible: boolean;
            reasons: any[];
            suggestedScholarships: any[];
        };
    }>;
    toggleStatus(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            eligibilityCriteria: string;
            amount: number;
            maxAmount: number | null;
            category: import(".prisma/client").$Enums.ScholarshipCategory;
            subCategory: string | null;
            applicationStartDate: Date;
            applicationEndDate: Date;
            academicYear: string;
            maxApplications: number | null;
            currentApplications: number;
            requirements: import("@prisma/client/runtime/library").JsonValue | null;
            documentsRequired: string[];
            priority: number;
            createdBy: string;
        };
    }>;
}
