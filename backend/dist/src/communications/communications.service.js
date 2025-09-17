"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunicationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
let CommunicationsService = class CommunicationsService {
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
    }
    async createCampaign(campaignData, userId) {
        try {
            const campaign = await this.prisma.communication.create({
                data: {
                    title: campaignData.title,
                    content: campaignData.content,
                    type: campaignData.type || 'EMAIL',
                    status: 'PENDING',
                    priority: 'MEDIUM',
                    targetAudience: campaignData.targetAudience || 'ALL',
                    scheduledAt: campaignData.scheduledAt ? new Date(campaignData.scheduledAt) : null,
                    metadata: campaignData.metadata || {},
                },
            });
            return {
                success: true,
                message: 'Campaign created successfully',
                data: campaign,
            };
        }
        catch (error) {
            throw new Error(`Failed to create campaign: ${error.message}`);
        }
    }
    async getCampaigns(query, user) {
        try {
            const where = {};
            if (query.status) {
                where.status = query.status;
            }
            if (query.type) {
                where.type = query.type;
            }
            const campaigns = await this.prisma.communication.findMany({
                where,
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return {
                success: true,
                data: campaigns,
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch campaigns: ${error.message}`);
        }
    }
    async getCampaign(id, user) {
        try {
            const campaign = await this.prisma.communication.findUnique({
                where: { id },
            });
            if (!campaign) {
                throw new common_1.NotFoundException('Campaign not found');
            }
            return {
                success: true,
                data: campaign,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to fetch campaign: ${error.message}`);
        }
    }
    async sendCampaign(id, userId) {
        try {
            const campaign = await this.prisma.communication.findUnique({
                where: { id },
            });
            if (!campaign) {
                throw new common_1.NotFoundException('Campaign not found');
            }
            await this.prisma.communication.update({
                where: { id },
                data: {
                    status: 'SENT',
                },
            });
            if (campaign.type === 'EMAIL') {
                console.log('Sending email campaign:', campaign.title);
            }
            else if (campaign.type === 'SMS') {
                console.log('Sending SMS campaign:', campaign.title);
            }
            return {
                success: true,
                message: 'Campaign sent successfully',
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to send campaign: ${error.message}`);
        }
    }
    async getCampaignStats(id, user) {
        try {
            const campaign = await this.prisma.communication.findUnique({
                where: { id },
            });
            if (!campaign) {
                throw new common_1.NotFoundException('Campaign not found');
            }
            const stats = {
                totalSent: 100,
                delivered: 95,
                opened: 60,
                clicked: 25,
                bounced: 5,
                unsubscribed: 2,
            };
            return {
                success: true,
                data: stats,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to fetch campaign stats: ${error.message}`);
        }
    }
    async sendEmail(emailData, userId) {
        try {
            await this.mailService.sendEmail({
                to: emailData.to,
                subject: emailData.subject,
                text: emailData.text,
                html: emailData.html,
            });
            return {
                success: true,
                message: 'Email sent successfully',
            };
        }
        catch (error) {
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
    async sendSMS(smsData, userId) {
        try {
            console.log('Sending SMS to:', smsData.to, 'Message:', smsData.message);
            return {
                success: true,
                message: 'SMS sent successfully',
            };
        }
        catch (error) {
            throw new Error(`Failed to send SMS: ${error.message}`);
        }
    }
};
exports.CommunicationsService = CommunicationsService;
exports.CommunicationsService = CommunicationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], CommunicationsService);
//# sourceMappingURL=communications.service.js.map