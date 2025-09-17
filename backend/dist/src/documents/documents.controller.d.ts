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
    getUserDocuments(req: any): Promise<{
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
    getDocument(id: string, req: any): Promise<{
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
    verifyDocument(id: string, body: {
        status: string;
        notes?: string;
    }, req: any): Promise<{
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
    deleteDocument(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
