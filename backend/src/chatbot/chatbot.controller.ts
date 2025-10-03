import { Controller, Post, Get, Body, UseGuards, Request, Query, HttpStatus, HttpException } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { AIService } from './ai.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(
    private readonly chatbotService: ChatbotService,
    private readonly aiService: AIService,
    private readonly prisma: PrismaService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('message')
  @ApiOperation({ summary: 'Send a message to chatbot' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: CreateChatMessageDto })
  async sendMessage(@Body() createChatMessageDto: CreateChatMessageDto, @Request() req) {
    try {
      // Use authenticated user's ID
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
    } catch (error) {
      console.error('Error sending message:', error);
      throw new HttpException(
        'Failed to send message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Public endpoint (no auth) – does not persist messages
  @Post('public')
  @ApiOperation({ summary: 'Send a public message to chatbot (no login required)' })
  @ApiResponse({ status: 201, description: 'Response generated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async sendPublicMessage(@Body() body: { message: string }) {
    try {
      const text = (body?.message || '').toString();
      if (!text.trim()) {
        return { success: false, message: 'Message is required' };
      }

      // Live DB context: active scholarships summary
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
    } catch (error) {
      console.error('Error sending public message:', error);
      throw new HttpException(
        'Failed to generate response',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Alias for frontend: /chatbot/ai-public
  @Post('ai-public')
  @ApiOperation({ summary: 'AI public endpoint (alias)' })
  async sendPublicMessageAlias(@Body() body: { message: string }) {
    return this.sendPublicMessage(body);
  }

  // AI (private) with personalization
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('ai')
  @ApiOperation({ summary: 'AI response with personalized context' })
  async sendPrivateAI(@Body() body: { message: string }, @Request() req) {
    try {
      const text = (body?.message || '').toString();
      if (!text.trim()) return { success: false, message: 'Message is required' };

      // Build context from user data
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
    } catch (error) {
      console.error('Error generating private AI response:', error);
      throw new HttpException('Failed to generate response', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get chat history' })
  @ApiResponse({ status: 200, description: 'Chat history retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getChatHistory(@Request() req, @Query('limit') limit?: string) {
    try {
      const userId = req.user.id;
      const limitNumber = limit ? parseInt(limit, 10) : 50;
      
      const history = await this.chatbotService.getChatHistory(userId, limitNumber);
      
      return {
        success: true,
        message: 'Chat history retrieved successfully',
        data: history,
      };
    } catch (error) {
      console.error('Error getting chat history:', error);
      throw new HttpException(
        'Failed to get chat history',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get chatbot statistics' })
  @ApiResponse({ status: 200, description: 'Chatbot stats retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getChatStats(@Request() req) {
    try {
      const userId = req.user.id;
      const stats = await this.chatbotService.getChatStats(userId);
      
      return {
        success: true,
        message: 'Chatbot stats retrieved successfully',
        data: stats,
      };
    } catch (error) {
      console.error('Error getting chat stats:', error);
      throw new HttpException(
        'Failed to get chat stats',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
