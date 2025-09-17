import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    create(createStudentDto: CreateStudentDto): Promise<{
        success: boolean;
        message: string;
        data: {
            createdAt: Date;
            firstName: string;
            lastName: string;
            dateOfBirth: string;
            gender: import(".prisma/client").Gender;
            phone?: string;
            address: string;
            city: string;
            state: string;
            pincode: string;
            aadharNumber?: string;
            panNumber?: string;
            fatherName?: string;
            motherName?: string;
            familyIncome?: number;
            profileImage?: string;
            educationLevel?: string;
            currentInstitution?: string;
            currentCourse?: string;
            cgpa?: number;
            id: string;
        };
    }>;
    getProfile(req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
                id: string;
                email: string;
                createdAt: Date;
                role: import(".prisma/client").$Enums.UserRole;
                isActive: boolean;
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
                applicationId: string | null;
                type: import(".prisma/client").$Enums.DocumentType;
                fileName: string;
                originalName: string;
                filePath: string;
                fileSize: number;
                mimeType: string;
                verifiedBy: string | null;
                verifiedAt: Date | null;
                uploadedAt: Date;
            }[];
        } & {
            id: string;
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
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    findAll(page?: number, limit?: number, search?: string, state?: string, isVerified?: boolean): Promise<{
        success: boolean;
        message: string;
        data: {
            data: ({
                user: {
                    email: string;
                    isActive: boolean;
                };
            } & {
                id: string;
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
                createdAt: Date;
                updatedAt: Date;
            })[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                pages: number;
            };
        };
    }>;
    findOne(id: string, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
                id: string;
                email: string;
                createdAt: Date;
                role: import(".prisma/client").$Enums.UserRole;
                isActive: boolean;
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
                applicationId: string | null;
                type: import(".prisma/client").$Enums.DocumentType;
                fileName: string;
                originalName: string;
                filePath: string;
                fileSize: number;
                mimeType: string;
                verifiedBy: string | null;
                verifiedAt: Date | null;
                uploadedAt: Date;
            }[];
        } & {
            id: string;
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
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    update(id: string, updateStudentDto: UpdateStudentDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
                id: string;
                email: string;
                role: import(".prisma/client").$Enums.UserRole;
                isActive: boolean;
            };
        } & {
            id: string;
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
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getApplications(id: string): Promise<{
        success: boolean;
        message: string;
        data: ({
            scholarship: {
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
    }>;
    getDocuments(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            isVerified: boolean;
            studentId: string;
            rejectionReason: string | null;
            applicationId: string | null;
            type: import(".prisma/client").$Enums.DocumentType;
            fileName: string;
            originalName: string;
            filePath: string;
            fileSize: number;
            mimeType: string;
            verifiedBy: string | null;
            verifiedAt: Date | null;
            uploadedAt: Date;
        }[];
    }>;
    verifyStudent(id: string, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
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
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
}
