import { PrismaService } from '../prisma/prisma.service';
export declare class DocumentsService {
    private prisma;
    constructor(prisma: PrismaService);
    uploadDocument(file: Express.Multer.File, body: any, userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            rejectionReason: string | null;
            studentId: string;
            isVerified: boolean;
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
        };
    }>;
    getUserDocuments(userId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            rejectionReason: string | null;
            studentId: string;
            isVerified: boolean;
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
    getDocument(id: string, userId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            rejectionReason: string | null;
            studentId: string;
            isVerified: boolean;
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
        };
    }>;
    verifyDocument(id: string, status: string, notes: string, userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            rejectionReason: string | null;
            studentId: string;
            isVerified: boolean;
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
        };
    }>;
    deleteDocument(id: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
