import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { GdprService } from './gdpr.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('GDPR Compliance')
@ApiBearerAuth()
@Controller('gdpr')
@UseGuards(JwtAuthGuard)
export class GdprController {
  constructor(private readonly gdprService: GdprService) {}

  @Post('consent')
  @ApiOperation({ summary: 'Record user consent for data processing' })
  @ApiResponse({
    status: 201,
    description: 'Consent recorded successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  async recordConsent(
    @Body() consentData: {
      dataTypes: string[];
      purpose: string;
      reason?: string;
    },
    @Body('ipAddress') ipAddress: string,
    @Body('userAgent') userAgent: string,
  ) {
    try {
      const { dataTypes, purpose, reason } = consentData;
      
      await this.gdprService.recordConsent(
        'current-user-id', // In real app, get from JWT
        dataTypes,
        purpose,
        ipAddress,
        userAgent
      );

      return {
        success: true,
        message: 'Consent recorded successfully',
        data: {
          dataTypes,
          purpose,
          recordedAt: new Date(),
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to record consent',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('consent/withdraw')
  @ApiOperation({ summary: 'Withdraw user consent' })
  @ApiResponse({
    status: 200,
    description: 'Consent withdrawn successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  async withdrawConsent(
    @Body() withdrawalData: {
      dataTypes: string[];
      reason?: string;
    }
  ) {
    try {
      const { dataTypes, reason } = withdrawalData;
      
      await this.gdprService.withdrawConsent(
        'current-user-id', // In real app, get from JWT
        dataTypes,
        reason
      );

      return {
        success: true,
        message: 'Consent withdrawn successfully',
        data: {
          dataTypes,
          reason,
          withdrawnAt: new Date(),
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to withdraw consent',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('data-export')
  @ApiOperation({ summary: 'Export user data (Right to Access)' })
  @ApiResponse({
    status: 200,
    description: 'User data exported successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async exportUserData() {
    try {
      const userData = await this.gdprService.exportUserData('current-user-id');
      
      return {
        success: true,
        message: 'User data exported successfully',
        data: userData,
      };
    } catch (error) {
      if (error.message === 'User not found') {
        throw new HttpException(
          {
            success: false,
            message: 'User not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        {
          success: false,
          message: 'Failed to export user data',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('data-deletion')
  @ApiOperation({ summary: 'Delete user data (Right to Erasure)' })
  @ApiResponse({
    status: 200,
    description: 'User data deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - cannot delete data',
  })
  async deleteUserData(
    @Body() deletionData: {
      reason: string;
      confirmDeletion: boolean;
    }
  ) {
    try {
      const { reason, confirmDeletion } = deletionData;
      
      if (!confirmDeletion) {
        throw new Error('Deletion confirmation required');
      }
      
      await this.gdprService.deleteUserData('current-user-id', reason);
      
      return {
        success: true,
        message: 'User data deleted successfully',
        data: {
          reason,
          deletedAt: new Date(),
        },
      };
    } catch (error) {
      if (error.message.includes('active applications')) {
        throw new HttpException(
          {
            success: false,
            message: 'Cannot delete user data while active applications exist',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      
      throw new HttpException(
        {
          success: false,
          message: 'Failed to delete user data',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('data-rectification')
  @ApiOperation({ summary: 'Rectify user data (Right to Rectification)' })
  @ApiResponse({
    status: 200,
    description: 'User data rectified successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  async rectifyUserData(
    @Body() rectificationData: {
      dataType: string;
      newValue: any;
      reason: string;
    }
  ) {
    try {
      const { dataType, newValue, reason } = rectificationData;
      
      await this.gdprService.rectifyUserData(
        'current-user-id', // In real app, get from JWT
        dataType,
        newValue,
        reason
      );
      
      return {
        success: true,
        message: 'User data rectified successfully',
        data: {
          dataType,
          newValue,
          reason,
          rectifiedAt: new Date(),
        },
      };
    } catch (error) {
      if (error.message.includes('Invalid data type')) {
        throw new HttpException(
          {
            success: false,
            message: 'Invalid data type',
            error: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      
      throw new HttpException(
        {
          success: false,
          message: 'Failed to rectify user data',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('data-processing-activities')
  @ApiOperation({ summary: 'Get data processing activities' })
  @ApiResponse({
    status: 200,
    description: 'Data processing activities retrieved successfully',
  })
  async getDataProcessingActivities() {
    try {
      const activities = await this.gdprService.getDataProcessingActivities();
      
      return {
        success: true,
        message: 'Data processing activities retrieved successfully',
        data: activities,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve data processing activities',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('retention-compliance')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Check data retention compliance (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Retention compliance checked successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async checkRetentionCompliance() {
    try {
      const compliance = await this.gdprService.checkRetentionCompliance();
      
      return {
        success: true,
        message: 'Retention compliance checked successfully',
        data: compliance,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to check retention compliance',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('privacy-policy')
  @ApiOperation({ summary: 'Get privacy policy information' })
  @ApiResponse({
    status: 200,
    description: 'Privacy policy retrieved successfully',
  })
  async getPrivacyPolicy() {
    try {
      const privacyPolicy = {
        version: '1.0',
        lastUpdated: '2024-01-01',
        dataController: 'TVS Group',
        contactEmail: 'privacy@tvsgroup.com',
        dataProcessingPurposes: [
          'Scholarship processing and management',
          'Payment processing and disbursement',
          'Communication and notifications',
          'Identity verification and fraud prevention',
          'Compliance with legal obligations',
        ],
        dataCategories: [
          'Personal identification data',
          'Contact information',
          'Financial information',
          'Academic records',
          'Documentation',
        ],
        legalBasis: [
          'Contract performance',
          'Legal obligation',
          'Consent',
          'Legitimate interest',
        ],
        dataRetention: '7 years from last interaction',
        userRights: [
          'Right to access',
          'Right to rectification',
          'Right to erasure',
          'Right to restrict processing',
          'Right to data portability',
          'Right to object',
        ],
        dataTransfers: [
          'Educational institutions',
          'Banking partners',
          'Government agencies (as required)',
        ],
        securityMeasures: [
          'Encryption at rest and in transit',
          'Access controls and authentication',
          'Regular security audits',
          'Data minimization',
          'Privacy by design',
        ],
      };
      
      return {
        success: true,
        message: 'Privacy policy retrieved successfully',
        data: privacyPolicy,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve privacy policy',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
