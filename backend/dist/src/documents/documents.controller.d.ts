import { DocumentsService } from './documents.service';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    uploadDocument(file: Express.Multer.File, body: any, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            type: import(".prisma/client").$Enums.DocumentType;
            studentId: string;
            rejectionReason: string | null;
            isVerified: boolean;
            uploadedAt: Date;
            applicationId: string | null;
            fileName: string;
            originalName: string;
            filePath: string;
            fileSize: number;
            mimeType: string;
            verifiedBy: string | null;
            verifiedAt: Date | null;
        };
    }>;
    getUserDocuments(req: any): Promise<{
        success: boolean;
        data: {
            id: string;
            type: import(".prisma/client").$Enums.DocumentType;
            studentId: string;
            rejectionReason: string | null;
            isVerified: boolean;
            uploadedAt: Date;
            applicationId: string | null;
            fileName: string;
            originalName: string;
            filePath: string;
            fileSize: number;
            mimeType: string;
            verifiedBy: string | null;
            verifiedAt: Date | null;
        }[];
    }>;
    getDocument(id: string, req: any): Promise<{
        success: boolean;
        data: {
            id: string;
            type: import(".prisma/client").$Enums.DocumentType;
            studentId: string;
            rejectionReason: string | null;
            isVerified: boolean;
            uploadedAt: Date;
            applicationId: string | null;
            fileName: string;
            originalName: string;
            filePath: string;
            fileSize: number;
            mimeType: string;
            verifiedBy: string | null;
            verifiedAt: Date | null;
        };
    }>;
    verifyDocument(id: string, body: {
        status: string;
        notes?: string;
    }, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            type: import(".prisma/client").$Enums.DocumentType;
            studentId: string;
            rejectionReason: string | null;
            isVerified: boolean;
            uploadedAt: Date;
            applicationId: string | null;
            fileName: string;
            originalName: string;
            filePath: string;
            fileSize: number;
            mimeType: string;
            verifiedBy: string | null;
            verifiedAt: Date | null;
        };
    }>;
    deleteDocument(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
