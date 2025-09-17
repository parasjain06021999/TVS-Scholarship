import { AuthService } from './auth/auth.service';
import { StudentsService } from './students/students.service';
import { ScholarshipsService } from './scholarships/scholarships.service';
export declare class AppController {
    private readonly authService;
    private readonly studentsService;
    private readonly scholarshipsService;
    constructor(authService: AuthService, studentsService: StudentsService, scholarshipsService: ScholarshipsService);
    getHello(): string;
    getHealth(): {
        status: string;
        timestamp: string;
        uptime: number;
    };
    login(loginDto: {
        email: string;
        password: string;
    }): Promise<{
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
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
            adminProfile: {
                firstName: string;
                lastName: string;
                phone: string | null;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                department: string | null;
            };
        };
        token: string;
    }>;
    register(registerDto: any): Promise<{
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
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
        };
        token: string;
    }>;
    getProfile(req: any): Promise<{
        user: any;
    }>;
    getScholarships(): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getStudentProfile(req: any): Promise<{
        user: {
            email: string;
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            isActive: boolean;
            createdAt: Date;
        };
        applications: ({
            scholarship: {
                id: string;
                title: string;
                amount: number;
                category: import(".prisma/client").$Enums.ScholarshipCategory;
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
        documents: {
            id: string;
            isVerified: boolean;
            studentId: string;
            rejectionReason: string | null;
            uploadedAt: Date;
            applicationId: string | null;
            type: import(".prisma/client").$Enums.DocumentType;
            fileName: string;
            originalName: string;
            filePath: string;
            fileSize: number;
            mimeType: string;
            verifiedBy: string | null;
            verifiedAt: Date | null;
        }[];
    } & {
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
    }>;
}
