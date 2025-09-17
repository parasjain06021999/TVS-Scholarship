import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class CommunicationsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async createCampaign(campaignData: any, userId: string) {
    try {
      const campaign = await this.prisma.communication.create({
        data: {
          title: campaignData.title,
          content: campaignData.content,
          type: campaignData.type || 'EMAIL',
          status: 'PENDING',
          priority: 'MEDIUM', // Required field
          // createdBy: userId, // Field doesn't exist in schema
          targetAudience: campaignData.targetAudience || 'ALL',
          scheduledAt: campaignData.scheduledAt ? new Date(campaignData.scheduledAt) : null,
          metadata: campaignData.metadata || {},
        } as any,
      });

      return {
        success: true,
        message: 'Campaign created successfully',
        data: campaign,
      };
    } catch (error) {
      throw new Error(`Failed to create campaign: ${error.message}`);
    }
  }

  async getCampaigns(query: any, user: any) {
    try {
      const where: any = {};

      if (query.status) {
        where.status = query.status;
      }

      if (query.type) {
        where.type = query.type;
      }

      const campaigns = await this.prisma.communication.findMany({
        where,
        // include: {
        //   user: {
        //     select: {
        //       id: true,
        //       email: true,
        //     },
        //   },
        // },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        success: true,
        data: campaigns,
      };
    } catch (error) {
      throw new Error(`Failed to fetch campaigns: ${error.message}`);
    }
  }

  async getCampaign(id: string, user: any) {
    try {
      const campaign = await this.prisma.communication.findUnique({
        where: { id },
        // include: {
        //   user: {
        //     select: {
        //       id: true,
        //       email: true,
        //     },
        //   },
        // },
      });

      if (!campaign) {
        throw new NotFoundException('Campaign not found');
      }

      return {
        success: true,
        data: campaign,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to fetch campaign: ${error.message}`);
    }
  }

  async sendCampaign(id: string, userId: string) {
    try {
      const campaign = await this.prisma.communication.findUnique({
        where: { id },
      });

      if (!campaign) {
        throw new NotFoundException('Campaign not found');
      }

      // Update campaign status
      await this.prisma.communication.update({
        where: { id },
        data: {
          status: 'SENT',
          // sentAt: new Date(), // Field doesn't exist in schema
        },
      });

      // TODO: Implement actual sending logic based on campaign type
      if (campaign.type === 'EMAIL') {
        // Send email campaign
        console.log('Sending email campaign:', campaign.title);
      } else if (campaign.type === 'SMS') {
        // Send SMS campaign
        console.log('Sending SMS campaign:', campaign.title);
      }

      return {
        success: true,
        message: 'Campaign sent successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to send campaign: ${error.message}`);
    }
  }

  async getCampaignStats(id: string, user: any) {
    try {
      const campaign = await this.prisma.communication.findUnique({
        where: { id },
      });

      if (!campaign) {
        throw new NotFoundException('Campaign not found');
      }

      // Mock statistics - replace with actual analytics
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
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to fetch campaign stats: ${error.message}`);
    }
  }

  async sendEmail(emailData: any, userId: string) {
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
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendSMS(smsData: any, userId: string) {
    try {
      // TODO: Integrate with SMS provider (Twilio/Msg91)
      console.log('Sending SMS to:', smsData.to, 'Message:', smsData.message);

      return {
        success: true,
        message: 'SMS sent successfully',
      };
    } catch (error) {
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }
}
