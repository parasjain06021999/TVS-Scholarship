import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(query: any, user: any): Promise<{
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
    getApplicationAnalytics(query: any, user: any): Promise<{
        success: boolean;
        data: {
            total: number;
            statusCounts: {};
            monthlyData: {};
            applications: ({
                student: {
                    email: string | null;
                    firstName: string;
                    lastName: string;
                    dateOfBirth: Date;
                    gender: import(".prisma/client").$Enums.Gender;
                    phone: string | null;
                    address: string;
                    city: string;
                    state: string;
                    pincode: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
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
                    userId: string;
                };
                scholarship: {
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
        };
    }>;
    getScholarshipAnalytics(query: any, user: any): Promise<{
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
    getPaymentAnalytics(query: any, user: any): Promise<{
        success: boolean;
        data: {
            total: number;
            statusCounts: {};
            totalAmount: number;
            payments: ({
                application: {
                    student: {
                        email: string | null;
                        firstName: string;
                        lastName: string;
                        dateOfBirth: Date;
                        gender: import(".prisma/client").$Enums.Gender;
                        phone: string | null;
                        address: string;
                        city: string;
                        state: string;
                        pincode: string;
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
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
                        userId: string;
                    };
                    scholarship: {
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
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                amount: number;
                status: import(".prisma/client").$Enums.PaymentStatus;
                remarks: string | null;
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
    getStudentAnalytics(query: any, user: any): Promise<{
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
    exportReport(query: any, user: any): Promise<{
        success: boolean;
        data: {
            content: string;
            filename: string;
        };
    } | {
        success: boolean;
        data: any[];
    }>;
    private convertToCSV;
}
