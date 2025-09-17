import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('feedback')
@UseGuards(AuthGuard('jwt'))
export class FeedbackController {
  @Post()
  async sendFeedback(
    @Body() body: {
      applicationId: string;
      type: 'GENERAL' | 'DOCUMENT_REQUEST' | 'INFORMATION_REQUEST' | 'CLARIFICATION';
      message: string;
    },
    @Request() req: any,
  ) {
    try {
      console.log('Feedback sent for application:', body.applicationId);
      console.log('Feedback type:', body.type);
      console.log('Feedback message:', body.message);
      console.log('Sent by:', req.user.id);

      return {
        success: true,
        message: 'Feedback sent successfully',
        data: {
          applicationId: body.applicationId,
          type: body.type,
          message: body.message,
          sentBy: req.user.id,
          sentAt: new Date().toISOString(),
        }
      };
    } catch (error) {
      console.error('Error sending feedback:', error);
      return {
        success: false,
        message: error.message || 'Failed to send feedback',
      };
    }
  }
}