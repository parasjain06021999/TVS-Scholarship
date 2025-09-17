import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GdprService } from './gdpr.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Compliance')
@Controller('compliance')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ComplianceController {
  constructor(private readonly gdprService: GdprService) {}

  @Get('gdpr/consent/:userId')
  @ApiOperation({ summary: 'Get user consent status' })
  @ApiResponse({ status: 200, description: 'Consent status retrieved successfully' })
  async getUserConsent(@Param('userId') userId: string, @Req() req: any) {
    return this.gdprService.getUserConsent(userId, req.user);
  }

  @Post('gdpr/consent')
  @ApiOperation({ summary: 'Update user consent' })
  @ApiResponse({ status: 200, description: 'Consent updated successfully' })
  async updateUserConsent(@Body() body: any, @Req() req: any) {
    return this.gdprService.updateUserConsent(body, req.user.id);
  }

  @Post('gdpr/data-export/:userId')
  @ApiOperation({ summary: 'Export user data (GDPR)' })
  @ApiResponse({ status: 200, description: 'User data exported successfully' })
  async exportUserData(@Param('userId') userId: string, @Req() req: any) {
    return this.gdprService.exportUserData(userId, req.user);
  }

  @Delete('gdpr/data-deletion/:userId')
  @ApiOperation({ summary: 'Delete user data (GDPR)' })
  @ApiResponse({ status: 200, description: 'User data deleted successfully' })
  async deleteUserData(@Param('userId') userId: string, @Req() req: any) {
    return this.gdprService.deleteUserData(userId, req.user);
  }

  @Get('gdpr/audit-trail')
  @ApiOperation({ summary: 'Get GDPR audit trail' })
  @ApiResponse({ status: 200, description: 'Audit trail retrieved successfully' })
  async getGdprAuditTrail(@Req() req: any) {
    return this.gdprService.getGdprAuditTrail(req.user);
  }

  @Post('gdpr/consent-request')
  @ApiOperation({ summary: 'Request user consent' })
  @ApiResponse({ status: 200, description: 'Consent request sent successfully' })
  async requestUserConsent(@Body() body: any, @Req() req: any) {
    return this.gdprService.requestUserConsent(body, req.user.id);
  }
}
