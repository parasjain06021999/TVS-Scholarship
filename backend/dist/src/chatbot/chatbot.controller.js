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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotController = void 0;
const common_1 = require("@nestjs/common");
const chatbot_service_1 = require("./chatbot.service");
const ai_service_1 = require("./ai.service");
const prisma_service_1 = require("../prisma/prisma.service");
const create_chat_message_dto_1 = require("./dto/create-chat-message.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let ChatbotController = class ChatbotController {
    constructor(chatbotService, aiService, prisma) {
        this.chatbotService = chatbotService;
        this.aiService = aiService;
        this.prisma = prisma;
    }
    async sendMessage(createChatMessageDto, req) {
        try {
            const userId = req.user.id;
            const messageData = {
                ...createChatMessageDto,
                userId,
            };
            const result = await this.chatbotService.createMessage(messageData);
            return {
                success: true,
                message: 'Message sent successfully',
                data: result,
            };
        }
        catch (error) {
            console.error('Error sending message:', error);
            throw new common_1.HttpException('Failed to send message', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async sendPublicMessage(body) {
        try {
            const text = (body?.message || '').toString();
            if (!text.trim()) {
                return { success: false, message: 'Message is required' };
            }
            const now = new Date();
            const active = await this.prisma.scholarship.findMany({
                where: {
                    isActive: true,
                    applicationEndDate: { gte: now },
                },
                orderBy: { applicationEndDate: 'asc' },
                select: { title: true, amount: true, category: true, applicationEndDate: true },
                take: 10,
            });
            const count = active.length;
            const items = active
                .map((s) => `• ${s.title} — ₹${s.amount} (${s.category}) — ends ${new Date(s.applicationEndDate).toLocaleDateString('en-IN')}`)
                .join('\n');
            const context = `Live data:\nActive scholarships count: ${count}\n${items || 'No active scholarships found.'}`;
            const response = await this.aiService.generate({ userMessage: text, context });
            return {
                success: true,
                message: 'Response generated successfully',
                data: {
                    userMessage: { id: 'temp', message: text, isFromBot: false, createdAt: new Date().toISOString() },
                    botResponse: { id: 'temp', message: response, isFromBot: true, createdAt: new Date().toISOString() },
                },
            };
        }
        catch (error) {
            console.error('Error sending public message:', error);
            throw new common_1.HttpException('Failed to generate response', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async sendPublicMessageAlias(body) {
        return this.sendPublicMessage(body);
    }
    async sendPrivateAI(body, req) {
        try {
            const text = (body?.message || '').toString();
            if (!text.trim())
                return { success: false, message: 'Message is required' };
            const userId = req.user.id;
            const apps = await this.chatbotService['prisma'].application.findMany({
                where: { student: { userId } },
                include: { scholarship: true },
                take: 5,
            });
            const statusLines = apps.map(a => `${a.scholarship?.title || 'Scholarship'} - ${a.status}`).join('\n');
            const context = `User personalized context:\nApplications:\n${statusLines || 'No applications.'}`;
            const response = await this.aiService.generate({ userMessage: text, context });
            return {
                success: true,
                message: 'Response generated successfully',
                data: {
                    userMessage: { id: 'temp', message: text, isFromBot: false, createdAt: new Date().toISOString() },
                    botResponse: { id: 'temp', message: response, isFromBot: true, createdAt: new Date().toISOString() },
                },
            };
        }
        catch (error) {
            console.error('Error generating private AI response:', error);
            throw new common_1.HttpException('Failed to generate response', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getChatHistory(req, limit) {
        try {
            const userId = req.user.id;
            const limitNumber = limit ? parseInt(limit, 10) : 50;
            const history = await this.chatbotService.getChatHistory(userId, limitNumber);
            return {
                success: true,
                message: 'Chat history retrieved successfully',
                data: history,
            };
        }
        catch (error) {
            console.error('Error getting chat history:', error);
            throw new common_1.HttpException('Failed to get chat history', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getChatStats(req) {
        try {
            const userId = req.user.id;
            const stats = await this.chatbotService.getChatStats(userId);
            return {
                success: true,
                message: 'Chatbot stats retrieved successfully',
                data: stats,
            };
        }
        catch (error) {
            console.error('Error getting chat stats:', error);
            throw new common_1.HttpException('Failed to get chat stats', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ChatbotController = ChatbotController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('message'),
    (0, swagger_1.ApiOperation)({ summary: 'Send a message to chatbot' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Message sent successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiBody)({ type: create_chat_message_dto_1.CreateChatMessageDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chat_message_dto_1.CreateChatMessageDto, Object]),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Post)('public'),
    (0, swagger_1.ApiOperation)({ summary: 'Send a public message to chatbot (no login required)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Response generated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "sendPublicMessage", null);
__decorate([
    (0, common_1.Post)('ai-public'),
    (0, swagger_1.ApiOperation)({ summary: 'AI public endpoint (alias)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "sendPublicMessageAlias", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('ai'),
    (0, swagger_1.ApiOperation)({ summary: 'AI response with personalized context' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "sendPrivateAI", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get chat history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Chat history retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "getChatHistory", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get chatbot statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Chatbot stats retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "getChatStats", null);
exports.ChatbotController = ChatbotController = __decorate([
    (0, swagger_1.ApiTags)('Chatbot'),
    (0, common_1.Controller)('chatbot'),
    __metadata("design:paramtypes", [chatbot_service_1.ChatbotService,
        ai_service_1.AIService,
        prisma_service_1.PrismaService])
], ChatbotController);
//# sourceMappingURL=chatbot.controller.js.map