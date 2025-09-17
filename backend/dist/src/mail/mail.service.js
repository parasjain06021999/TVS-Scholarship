"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let MailService = class MailService {
    constructor(configService) {
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('SMTP_HOST', 'smtp.gmail.com'),
            port: this.configService.get('SMTP_PORT', 587),
            secure: false,
            auth: {
                user: this.configService.get('SMTP_USER'),
                pass: this.configService.get('SMTP_PASS'),
            },
        });
    }
    async sendPasswordResetEmail(email, resetToken) {
        const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}`;
        const mailOptions = {
            from: this.configService.get('SMTP_FROM', 'noreply@tvsscholarship.com'),
            to: email,
            subject: 'Password Reset - TVS Scholarship',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a365d 0%, #3182ce 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">TVS Scholarship</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Password Reset Request</p>
          </div>
          
          <div style="padding: 30px; background: #f7fafc;">
            <h2 style="color: #2d3748; margin-top: 0;">Reset Your Password</h2>
            <p style="color: #4a5568; line-height: 1.6;">
              You requested to reset your password for your TVS Scholarship account. 
              Click the button below to reset your password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #3182ce; color: white; padding: 12px 30px; text-decoration: none; 
                        border-radius: 6px; display: inline-block; font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #718096; font-size: 14px; line-height: 1.6;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${resetUrl}" style="color: #3182ce;">${resetUrl}</a>
            </p>
            
            <div style="background: #e2e8f0; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="color: #4a5568; margin: 0; font-size: 14px;">
                <strong>Security Note:</strong> This link will expire in 1 hour for your security. 
                If you didn't request this password reset, please ignore this email.
              </p>
            </div>
          </div>
          
          <div style="background: #2d3748; padding: 20px; text-align: center;">
            <p style="color: #a0aec0; margin: 0; font-size: 14px;">
              © 2024 TVS Scholarship. All rights reserved.
            </p>
            <p style="color: #a0aec0; margin: 5px 0 0 0; font-size: 12px;">
              This is an automated message, please do not reply to this email.
            </p>
          </div>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            return { success: true, message: 'Password reset email sent successfully' };
        }
        catch (error) {
            console.error('Error sending password reset email:', error);
            throw new Error('Failed to send password reset email');
        }
    }
    async sendWelcomeEmail(email, firstName) {
        const mailOptions = {
            from: this.configService.get('SMTP_FROM', 'noreply@tvsscholarship.com'),
            to: email,
            subject: 'Welcome to TVS Scholarship - Account Created Successfully',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a365d 0%, #3182ce 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to TVS Scholarship!</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your account has been created successfully</p>
          </div>
          
          <div style="padding: 30px; background: #f7fafc;">
            <h2 style="color: #2d3748; margin-top: 0;">Hello ${firstName}!</h2>
            <p style="color: #4a5568; line-height: 1.6;">
              Welcome to the TVS Scholarship Ecosystem! Your account has been created successfully 
              and you can now start applying for scholarships.
            </p>
            
            <div style="background: #e6fffa; border-left: 4px solid #38a169; padding: 15px; margin: 20px 0;">
              <h3 style="color: #2d3748; margin-top: 0;">Next Steps:</h3>
              <ul style="color: #4a5568; margin: 0; padding-left: 20px;">
                <li>Complete your profile information</li>
                <li>Browse available scholarships</li>
                <li>Submit your scholarship applications</li>
                <li>Upload required documents</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.configService.get('FRONTEND_URL')}/dashboard" 
                 style="background: #38a169; color: white; padding: 12px 30px; text-decoration: none; 
                        border-radius: 6px; display: inline-block; font-weight: bold;">
                Go to Dashboard
              </a>
            </div>
          </div>
          
          <div style="background: #2d3748; padding: 20px; text-align: center;">
            <p style="color: #a0aec0; margin: 0; font-size: 14px;">
              © 2024 TVS Scholarship. All rights reserved.
            </p>
          </div>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            return { success: true, message: 'Welcome email sent successfully' };
        }
        catch (error) {
            console.error('Error sending welcome email:', error);
            throw new Error('Failed to send welcome email');
        }
    }
    async sendApplicationStatusEmail(email, firstName, status, scholarshipName) {
        const statusColors = {
            'SUBMITTED': '#3182ce',
            'UNDER_REVIEW': '#d69e2e',
            'APPROVED': '#38a169',
            'REJECTED': '#e53e3e',
        };
        const statusMessages = {
            'SUBMITTED': 'Your application has been submitted successfully and is being processed.',
            'UNDER_REVIEW': 'Your application is currently under review by our team.',
            'APPROVED': 'Congratulations! Your application has been approved.',
            'REJECTED': 'Unfortunately, your application has been rejected.',
        };
        const mailOptions = {
            from: this.configService.get('SMTP_FROM', 'noreply@tvsscholarship.com'),
            to: email,
            subject: `Application ${status} - ${scholarshipName}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a365d 0%, #3182ce 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">TVS Scholarship</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Application Status Update</p>
          </div>
          
          <div style="padding: 30px; background: #f7fafc;">
            <h2 style="color: #2d3748; margin-top: 0;">Hello ${firstName}!</h2>
            <p style="color: #4a5568; line-height: 1.6;">
              We have an update regarding your scholarship application for <strong>${scholarshipName}</strong>.
            </p>
            
            <div style="background: ${statusColors[status]}20; border-left: 4px solid ${statusColors[status]}; padding: 15px; margin: 20px 0;">
              <h3 style="color: ${statusColors[status]}; margin-top: 0; text-transform: uppercase;">${status.replace('_', ' ')}</h3>
              <p style="color: #4a5568; margin: 0;">${statusMessages[status]}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.configService.get('FRONTEND_URL')}/applications" 
                 style="background: ${statusColors[status]}; color: white; padding: 12px 30px; text-decoration: none; 
                        border-radius: 6px; display: inline-block; font-weight: bold;">
                View Application
              </a>
            </div>
          </div>
          
          <div style="background: #2d3748; padding: 20px; text-align: center;">
            <p style="color: #a0aec0; margin: 0; font-size: 14px;">
              © 2024 TVS Scholarship. All rights reserved.
            </p>
          </div>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            return { success: true, message: 'Application status email sent successfully' };
        }
        catch (error) {
            console.error('Error sending application status email:', error);
            throw new Error('Failed to send application status email');
        }
    }
    async sendNotificationEmail(email, title, message, type) {
        const mailOptions = {
            from: this.configService.get('SMTP_FROM', 'noreply@tvsscholarship.com'),
            to: email,
            subject: `${title} - TVS Scholarship`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a365d 0%, #3182ce 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">TVS Scholarship</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">${title}</p>
          </div>
          
          <div style="padding: 30px; background: #f7fafc;">
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <p style="color: #4a5568; line-height: 1.6; margin: 0;">${message}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.configService.get('FRONTEND_URL')}/dashboard" 
                 style="background: #3182ce; color: white; padding: 12px 30px; text-decoration: none; 
                        border-radius: 6px; display: inline-block; font-weight: bold;">
                Go to Dashboard
              </a>
            </div>
          </div>
          
          <div style="background: #2d3748; padding: 20px; text-align: center;">
            <p style="color: #a0aec0; margin: 0; font-size: 14px;">
              © 2024 TVS Scholarship. All rights reserved.
            </p>
          </div>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            return { success: true, message: 'Notification email sent successfully' };
        }
        catch (error) {
            console.error('Error sending notification email:', error);
            throw new Error('Failed to send notification email');
        }
    }
    async sendEmail(emailData) {
        const mailOptions = {
            from: this.configService.get('SMTP_FROM', 'noreply@tvsscholarship.com'),
            to: emailData.to,
            subject: emailData.subject,
            text: emailData.text,
            html: emailData.html,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Email sent to ${emailData.to}`);
        }
        catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map