import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    sendPasswordResetEmail(email: string, resetToken: string): Promise<{
        success: boolean;
        message: string;
    }>;
    sendWelcomeEmail(email: string, firstName: string): Promise<{
        success: boolean;
        message: string;
    }>;
    sendApplicationStatusEmail(email: string, firstName: string, status: string, scholarshipName: string): Promise<{
        success: boolean;
        message: string;
    }>;
    sendNotificationEmail(email: string, title: string, message: string, type: string): Promise<{
        success: boolean;
        message: string;
    }>;
    sendEmail(emailData: {
        to: string;
        subject: string;
        text?: string;
        html?: string;
    }): Promise<void>;
}
