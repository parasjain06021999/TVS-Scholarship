import { PrismaService } from '../prisma/prisma.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
export declare class ChatbotService {
    private prisma;
    constructor(prisma: PrismaService);
    createMessage(createChatMessageDto: CreateChatMessageDto): Promise<{
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
    }>;
    getChatHistory(userId: string, limit?: number): Promise<{
        id: string;
        message: string;
        response: string | null;
        isFromBot: boolean;
        messageType: import(".prisma/client").$Enums.ChatMessageType;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }[]>;
    generateBotResponse(userMessage: string, userId: string | null): Promise<string>;
    getChatStats(userId: string): Promise<{
        totalMessages: number;
        todayMessages: number;
    }>;
}
