import { PrismaService } from '../prisma/prisma.service';
export declare class DocumentsService {
    private prisma;
    constructor(prisma: PrismaService);
    uploadDocument(file: Express.Multer.File, body: any, userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            type: import(".prisma/client").$Enums.DocumentType;
            fileName: string;
            originalName: string;
            filePath: string;
            fileSize: number;
            mimeType: string;
            isVerified: boolean;
            verifiedBy: string | null;
            verifiedAt: Date | null;
            rejectionReason: string | null;
            uploadedAt: Date;
            studentId: string;
            applicationId: string | null;
        };
    }>;
    getUserDocuments(userId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            type: import(".prisma/client").$Enums.DocumentType;
            fileName: string;
            originalName: string;
            filePath: string;
            fileSize: number;
            mimeType: string;
            isVerified: boolean;
            verifiedBy: string | null;
            verifiedAt: Date | null;
            rejectionReason: string | null;
            uploadedAt: Date;
            studentId: string;
            applicationId: string | null;
        }[];
    }>;
    getDocument(id: string, userId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            type: import(".prisma/client").$Enums.DocumentType;
            fileName: string;
            originalName: string;
            filePath: string;
            fileSize: number;
            mimeType: string;
            isVerified: boolean;
            verifiedBy: string | null;
            verifiedAt: Date | null;
            rejectionReason: string | null;
            uploadedAt: Date;
            studentId: string;
            applicationId: string | null;
        };
    }>;
    verifyDocument(id: string, status: string, notes: string, userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            type: import(".prisma/client").$Enums.DocumentType;
            fileName: string;
            originalName: string;
            filePath: string;
            fileSize: number;
            mimeType: string;
            isVerified: boolean;
            verifiedBy: string | null;
            verifiedAt: Date | null;
            rejectionReason: string | null;
            uploadedAt: Date;
            studentId: string;
            applicationId: string | null;
        };
    }>;
    deleteDocument(id: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
