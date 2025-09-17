import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getDashboardStats(query: any, req: any): Promise<{
        success: boolean;
        data: {
            totalApplications: number;
            pendingApplications: number;
            approvedApplications: number;
            rejectedApplications: number;
            totalScholarships: number;
            totalStudents: number;
            totalPayments: number;
            totalAmountDisbursed: number;
        };
    }>;
    getApplicationAnalytics(query: any, req: any): Promise<{
        success: boolean;
        data: {
            total: number;
            statusCounts: {};
            monthlyData: {};
            applications: ({
                student: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    firstName: string;
                    lastName: string;
                    dateOfBirth: Date;
                    gender: import(".prisma/client").$Enums.Gender;
                    phone: string | null;
                    email: string | null;
                    address: string;
                    city: string;
                    state: string;
                    pincode: string;
                    country: string;
                    aadharNumber: string | null;
                    panNumber: string | null;
                    fatherName: string;
                    fatherOccupation: string | null;
                    motherName: string;
                    motherOccupation: string | null;
                    familyIncome: number | null;
                    emergencyContact: string | null;
                    profileImage: string | null;
                    isVerified: boolean;
                };
                scholarship: {
                    id: string;
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
                    isActive: boolean;
                    maxApplications: number | null;
                    currentApplications: number;
                    requirements: import("@prisma/client/runtime/library").JsonValue | null;
                    documentsRequired: string[];
                    priority: number;
                    createdBy: string;
                };
            } & {
                id: string;
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
                createdAt: Date;
                updatedAt: Date;
                studentId: string;
                scholarshipId: string;
            })[];
        };
    }>;
    getScholarshipAnalytics(query: any, req: any): Promise<{
        success: boolean;
        data: {
            id: string;
            title: string;
            totalApplications: number;
            approvedApplications: number;
            pendingApplications: number;
            rejectedApplications: number;
            totalAmount: number;
            disbursedAmount: number;
        }[];
    }>;
    getPaymentAnalytics(query: any, req: any): Promise<{
        success: boolean;
        data: {
            total: number;
            statusCounts: {};
            totalAmount: number;
            payments: ({
                application: {
                    student: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        firstName: string;
                        lastName: string;
                        dateOfBirth: Date;
                        gender: import(".prisma/client").$Enums.Gender;
                        phone: string | null;
                        email: string | null;
                        address: string;
                        city: string;
                        state: string;
                        pincode: string;
                        country: string;
                        aadharNumber: string | null;
                        panNumber: string | null;
                        fatherName: string;
                        fatherOccupation: string | null;
                        motherName: string;
                        motherOccupation: string | null;
                        familyIncome: number | null;
                        emergencyContact: string | null;
                        profileImage: string | null;
                        isVerified: boolean;
                    };
                    scholarship: {
                        id: string;
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
                        isActive: boolean;
                        maxApplications: number | null;
                        currentApplications: number;
                        requirements: import("@prisma/client/runtime/library").JsonValue | null;
                        documentsRequired: string[];
                        priority: number;
                        createdBy: string;
                    };
                } & {
                    id: string;
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
                    createdAt: Date;
                    updatedAt: Date;
                    studentId: string;
                    scholarshipId: string;
                };
            } & {
                id: string;
                status: import(".prisma/client").$Enums.PaymentStatus;
                remarks: string | null;
                createdAt: Date;
                updatedAt: Date;
                amount: number;
                applicationId: string;
                paymentMethod: string | null;
                transactionId: string | null;
                paymentDate: Date | null;
                bankName: string | null;
                bankReference: string | null;
                upiReference: string | null;
                accountNumber: string | null;
                failureReason: string | null;
                ifscCode: string | null;
                processedAt: Date | null;
                accountHolderName: string | null;
                processedBy: string | null;
            })[];
        };
    }>;
    getStudentAnalytics(query: any, req: any): Promise<{
        success: boolean;
        data: {
            totalStudents: number;
            studentsWithApplications: number;
            studentsByGender: {};
            studentsByState: {};
            topPerformingStudents: {
                id: string;
                name: string;
                applicationsCount: number;
                approvedCount: number;
            }[];
        };
    }>;
    exportReport(query: any, req: any): Promise<{
        success: boolean;
        data: {
            content: string;
            filename: string;
        };
    } | {
        success: boolean;
        data: any[];
    }>;
}
