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
exports.ChatbotService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ChatbotService = class ChatbotService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createMessage(createChatMessageDto) {
        const { userId, message } = createChatMessageDto;
        const userMessage = await this.prisma.chatMessage.create({
            data: {
                userId,
                message,
                isFromBot: false,
                messageType: 'USER_MESSAGE',
            },
        });
        const botResponse = await this.generateBotResponse(message, userId);
        const botMessage = await this.prisma.chatMessage.create({
            data: {
                userId,
                message: botResponse,
                isFromBot: true,
                messageType: 'BOT_RESPONSE',
            },
        });
        return {
            userMessage,
            botResponse: botMessage,
        };
    }
    async getChatHistory(userId, limit = 50) {
        return this.prisma.chatMessage.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' },
            take: limit,
        });
    }
    async generateBotResponse(userMessage, userId) {
        const message = userMessage.toLowerCase();
        const userApplications = userId
            ? await this.prisma.application.findMany({
                where: { student: { userId } },
                include: { scholarship: true },
            })
            : [];
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return "Hello! I'm the TVS Scholarship Assistant. How can I help you today? You can ask me about:\n• Application status\n• Scholarship information\n• Document requirements\n• General queries";
        }
        if (message.includes('application status') || message.includes('application')) {
            if (userApplications.length === 0) {
                return "You haven't submitted any applications yet. If you have an account, please login to see your application status.";
            }
            const statusSummary = userApplications.map(app => `• ${app.scholarship.title}: ${app.status}`).join('\n');
            return `Here's your application status:\n${statusSummary}\n\nFor detailed information, please check your dashboard.`;
        }
        if (message.includes('scholarship') || message.includes('scholarships')) {
            const scholarships = await this.prisma.scholarship.findMany({
                where: { isActive: true },
                take: 5,
            });
            if (scholarships.length === 0) {
                return "Currently, there are no active scholarships available. Please check back later.";
            }
            const scholarshipList = scholarships.map(sch => `• ${sch.title} - ₹${sch.amount} (${sch.category})`).join('\n');
            return `Here are the available scholarships:\n${scholarshipList}\n\nFor more details, visit the scholarships page.`;
        }
        if (message.includes('document') || message.includes('documents')) {
            return "For document requirements:\n• Aadhaar Card\n• Academic certificates\n• Income certificate\n• Bank account details\n• Passport size photo\n\nMake sure all documents are clear and readable.";
        }
        if (message.includes('eligibility') || message.includes('eligible')) {
            return "Eligibility criteria vary by scholarship:\n• Merit-based: Academic performance\n• Need-based: Family income\n• Minority: Community requirements\n\nCheck specific scholarship details for exact eligibility criteria.";
        }
        if (message.includes('payment') || message.includes('disbursement')) {
            const approvedApplications = userApplications.filter(app => app.status === 'APPROVED');
            if (approvedApplications.length === 0) {
                return "You don't have any approved applications yet. Payments are processed after application approval.";
            }
            return "Payment information:\n• Payments are processed after approval\n• Bank account details are required\n• Processing time: 7-15 business days\n• You'll receive notification when payment is processed";
        }
        if (message.includes('help') || message.includes('support')) {
            return "I can help you with:\n• Application status and tracking\n• Scholarship information\n• Document requirements\n• Eligibility criteria\n• Payment and disbursement info\n• General queries\n\nWhat would you like to know?";
        }
        if (message.includes('contact') || message.includes('phone') || message.includes('email')) {
            return "For direct support:\n• Email: support@tvsscholarship.com\n• Phone: +91 44 1234 5678\n• Office Hours: 9 AM - 6 PM (Mon-Fri)\n• You can also use the contact form on our website";
        }
        if (message.includes('deadline') || message.includes('last date')) {
            const activeScholarships = await this.prisma.scholarship.findMany({
                where: {
                    isActive: true,
                    applicationEndDate: {
                        gte: new Date(),
                    },
                },
                orderBy: { applicationEndDate: 'asc' },
                take: 3,
            });
            if (activeScholarships.length === 0) {
                return "Currently, there are no active scholarship applications open.";
            }
            const deadlines = activeScholarships.map(sch => `• ${sch.title}: ${new Date(sch.applicationEndDate).toLocaleDateString()}`).join('\n');
            return `Upcoming deadlines:\n${deadlines}\n\nApply soon to avoid missing out!`;
        }
        return "I understand you're asking about: '" + userMessage + "'\n\nI can help you with:\n• Application status\n• Scholarship information\n• Document requirements\n• Eligibility criteria\n• Payment information\n• General support\n\nCould you please rephrase your question or ask about one of these topics?";
    }
    async getChatStats(userId) {
        const totalMessages = await this.prisma.chatMessage.count({
            where: { userId },
        });
        const todayMessages = await this.prisma.chatMessage.count({
            where: {
                userId,
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
            },
        });
        return {
            totalMessages,
            todayMessages,
        };
    }
};
exports.ChatbotService = ChatbotService;
exports.ChatbotService = ChatbotService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatbotService);
//# sourceMappingURL=chatbot.service.js.map