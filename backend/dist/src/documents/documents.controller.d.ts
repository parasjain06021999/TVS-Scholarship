import { DocumentsService } from './documents.service';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    uploadDocument(file: Express.Multer.File, body: any, req: any): Promise<{
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
    getUserDocuments(req: any): Promise<{
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
    getDocument(id: string, req: any): Promise<{
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
    verifyDocument(id: string, body: {
        status: string;
        notes?: string;
    }, req: any): Promise<{
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
    deleteDocument(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
