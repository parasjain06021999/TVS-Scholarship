export declare class FeedbackController {
    sendFeedback(body: {
        applicationId: string;
        type: 'GENERAL' | 'DOCUMENT_REQUEST' | 'INFORMATION_REQUEST' | 'CLARIFICATION';
        message: string;
    }, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            applicationId: string;
            type: "GENERAL" | "DOCUMENT_REQUEST" | "INFORMATION_REQUEST" | "CLARIFICATION";
            message: string;
            sentBy: any;
            sentAt: string;
        };
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
}
