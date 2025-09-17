import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommunicationsService } from './communications.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Communications')
@Controller('communications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class CommunicationsController {
  constructor(private readonly communicationsService: CommunicationsService) {}

  @Post('campaigns')
  @ApiOperation({ summary: 'Create a new communication campaign' })
  @ApiResponse({ status: 201, description: 'Campaign created successfully' })
  async createCampaign(@Body() body: any, @Req() req: any) {
    return this.communicationsService.createCampaign(body, req.user.id);
  }

  @Get('campaigns')
  @ApiOperation({ summary: 'Get all campaigns' })
  @ApiResponse({ status: 200, description: 'Campaigns retrieved successfully' })
  async getCampaigns(@Query() query: any, @Req() req: any) {
    return this.communicationsService.getCampaigns(query, req.user);
  }

  @Get('campaigns/:id')
  @ApiOperation({ summary: 'Get campaign by ID' })
  @ApiResponse({ status: 200, description: 'Campaign retrieved successfully' })
  async getCampaign(@Param('id') id: string, @Req() req: any) {
    return this.communicationsService.getCampaign(id, req.user);
  }

  @Post('campaigns/:id/send')
  @ApiOperation({ summary: 'Send campaign' })
  @ApiResponse({ status: 200, description: 'Campaign sent successfully' })
  async sendCampaign(@Param('id') id: string, @Req() req: any) {
    return this.communicationsService.sendCampaign(id, req.user.id);
  }

  @Get('campaigns/:id/stats')
  @ApiOperation({ summary: 'Get campaign statistics' })
  @ApiResponse({ status: 200, description: 'Campaign stats retrieved successfully' })
  async getCampaignStats(@Param('id') id: string, @Req() req: any) {
    return this.communicationsService.getCampaignStats(id, req.user);
  }

  @Post('send-email')
  @ApiOperation({ summary: 'Send individual email' })
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  async sendEmail(@Body() body: any, @Req() req: any) {
    return this.communicationsService.sendEmail(body, req.user.id);
  }

  @Post('send-sms')
  @ApiOperation({ summary: 'Send individual SMS' })
  @ApiResponse({ status: 200, description: 'SMS sent successfully' })
  async sendSMS(@Body() body: any, @Req() req: any) {
    return this.communicationsService.sendSMS(body, req.user.id);
  }
}
