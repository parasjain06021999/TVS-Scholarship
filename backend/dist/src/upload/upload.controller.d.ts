export declare class UploadController {
    uploadDocument(file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            filename: string;
            originalName: string;
            size: number;
            mimetype: string;
            path: string;
            url: string;
        };
    }>;
}
