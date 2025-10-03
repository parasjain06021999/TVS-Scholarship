import { ChatbotService } from './chatbot.service';
import { AIService } from './ai.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
export declare class ChatbotController {
    private readonly chatbotService;
    private readonly aiService;
    private readonly prisma;
    constructor(chatbotService: ChatbotService, aiService: AIService, prisma: PrismaService);
    sendMessage(createChatMessageDto: CreateChatMessageDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            userMessage: {
                id: string;
                message: string;
                response: string | null;
                isFromBot: boolean;
                messageType: import(".prisma/client").$Enums.ChatMessageType;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
            };
            botResponse: {
                id: string;
                message: string;
                response: string | null;
                isFromBot: boolean;
                messageType: import(".prisma/client").$Enums.ChatMessageType;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
            };
        };
    }>;
    sendPublicMessage(body: {
        message: string;
    }): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: {
            userMessage: {
                id: string;
                message: string;
                isFromBot: boolean;
                createdAt: string;
            };
            botResponse: {
                id: string;
                message: string;
                isFromBot: boolean;
                createdAt: string;
            };
        };
    }>;
    sendPublicMessageAlias(body: {
        message: string;
    }): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: {
            userMessage: {
                id: string;
                message: string;
                isFromBot: boolean;
                createdAt: string;
            };
            botResponse: {
                id: string;
                message: string;
                isFromBot: boolean;
                createdAt: string;
            };
        };
    }>;
    sendPrivateAI(body: {
        message: string;
    }, req: any): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: {
            userMessage: {
                id: string;
                message: string;
                isFromBot: boolean;
                createdAt: string;
            };
            botResponse: {
                id: string;
                message: string;
                isFromBot: boolean;
                createdAt: string;
            };
        };
    }>;
    getChatHistory(req: any, limit?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            message: string;
            response: string | null;
            isFromBot: boolean;
            messageType: import(".prisma/client").$Enums.ChatMessageType;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        }[];
    }>;
    getChatStats(req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            totalMessages: number;
            todayMessages: number;
        };
    }>;
}
