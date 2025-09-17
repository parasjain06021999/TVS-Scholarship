import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async sendFeedback(applicationId: string, feedbackData: {
    type: 'GENERAL' | 'DOCUMENT_REQUEST' | 'INFORMATION_REQUEST' | 'CLARIFICATION';
    message: string;
    sentBy: string;
  }) {
    try {
      // Create feedback record
      const feedback = await this.prisma.feedback.create({
        data: {
          applicationId,
          type: feedbackData.type,
          message: feedbackData.message,
          sentBy: feedbackData.sentBy,
          status: 'SENT',
        },
      });

      // Update application status if needed
      if (feedbackData.type === 'DOCUMENT_REQUEST' || feedbackData.type === 'INFORMATION_REQUEST') {
        await this.prisma.application.update({
          where: { id: applicationId },
          data: { 
            status: 'UNDER_REVIEW',
            adminNotes: `Feedback sent: ${feedbackData.message}`,
          },
        });
      }

      return {
        success: true,
        message: 'Feedback sent successfully',
        data: feedback,
      };
    } catch (error) {
      console.error('Error sending feedback:', error);
      throw new Error(`Failed to send feedback: ${error.message}`);
    }
  }

  async getFeedbackByApplication(applicationId: string) {
    try {
      const feedback = await this.prisma.feedback.findMany({
        where: { applicationId },
        orderBy: { createdAt: 'desc' },
        include: {
          sentByUser: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      });

      return {
        success: true,
        message: 'Feedback retrieved successfully',
        data: feedback,
      };
    } catch (error) {
      console.error('Error retrieving feedback:', error);
      throw new Error(`Failed to retrieve feedback: ${error.message}`);
    }
  }

  async markFeedbackAsRead(feedbackId: string) {
    try {
      const feedback = await this.prisma.feedback.update({
        where: { id: feedbackId },
        data: { status: 'READ' },
      });

      return {
        success: true,
        message: 'Feedback marked as read',
        data: feedback,
      };
    } catch (error) {
      console.error('Error marking feedback as read:', error);
      throw new Error(`Failed to mark feedback as read: ${error.message}`);
    }
  }
}

