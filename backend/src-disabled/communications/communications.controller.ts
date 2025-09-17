import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { CommunicationsService } from './communications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Communications')
@ApiBearerAuth()
@Controller('communications')
@UseGuards(JwtAuthGuard)
export class CommunicationsController {
  constructor(private readonly communicationsService: CommunicationsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.REVIEWER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create and send communication (Admin/Reviewer only)' })
  @ApiResponse({
    status: 201,
    description: 'Communication created and sent successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin/Reviewer access required',
  })
  async createCommunication(
    @Body() communicationData: {
      title: string;
      content: string;
      type: 'EMAIL' | 'SMS' | 'PUSH' | 'ANNOUNCEMENT';
      priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
      targetAudience: {
        type: 'ALL' | 'STUDENTS' | 'ADMINS' | 'REVIEWERS' | 'CUSTOM';
        userIds?: string[];
        filters?: {
          state?: string;
          scholarshipId?: string;
          applicationStatus?: string;
          userRole?: string;
        };
      };
      scheduledAt?: string;
      templateId?: string;
      metadata?: any;
    },
  ) {
    try {
      const { scheduledAt, ...data } = communicationData;
      
      const communication = await this.communicationsService.createCommunication({
        ...data,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      });

      return {
        success: true,
        message: 'Communication created and sent successfully',
        data: communication,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to create communication',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.REVIEWER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get communications (Admin/Reviewer only)' })
  @ApiQuery({ name: 'type', required: false, type: String, description: 'Filter by type' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by status' })
  @ApiQuery({ name: 'priority', required: false, type: String, description: 'Filter by priority' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({
    status: 200,
    description: 'Communications retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin/Reviewer access required',
  })
  async getCommunications(
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    try {
      const result = await this.communicationsService.getCommunications({
        type,
        status,
        priority,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      });

      return {
        success: true,
        message: 'Communications retrieved successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve communications',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('announcements')
  @ApiOperation({ summary: 'Get announcements' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' })
  @ApiQuery({ name: 'priority', required: false, type: String, description: 'Filter by priority' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({
    status: 200,
    description: 'Announcements retrieved successfully',
  })
  async getAnnouncements(
    @Query('isActive') isActive?: string,
    @Query('priority') priority?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    try {
      const result = await this.communicationsService.getAnnouncements({
        isActive: isActive ? isActive === 'true' : undefined,
        priority,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      });

      return {
        success: true,
        message: 'Announcements retrieved successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve announcements',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.REVIEWER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get communication statistics (Admin/Reviewer only)' })
  @ApiResponse({
    status: 200,
    description: 'Communication statistics retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin/Reviewer access required',
  })
  async getCommunicationStats() {
    try {
      const stats = await this.communicationsService.getCommunicationStats();

      return {
        success: true,
        message: 'Communication statistics retrieved successfully',
        data: stats,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve communication statistics',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('templates')
  @Roles(UserRole.ADMIN, UserRole.REVIEWER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create email template (Admin/Reviewer only)' })
  @ApiResponse({
    status: 201,
    description: 'Email template created successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin/Reviewer access required',
  })
  async createEmailTemplate(
    @Body() templateData: {
      name: string;
      subject: string;
      content: string;
      variables: string[];
      category: string;
    },
  ) {
    try {
      const template = await this.communicationsService.createEmailTemplate(templateData);

      return {
        success: true,
        message: 'Email template created successfully',
        data: template,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to create email template',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('templates')
  @Roles(UserRole.ADMIN, UserRole.REVIEWER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get email templates (Admin/Reviewer only)' })
  @ApiQuery({ name: 'category', required: false, type: String, description: 'Filter by category' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({
    status: 200,
    description: 'Email templates retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin/Reviewer access required',
  })
  async getEmailTemplates(
    @Query('category') category?: string,
    @Query('isActive') isActive?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    try {
      const result = await this.communicationsService.getEmailTemplates({
        category,
        isActive: isActive ? isActive === 'true' : undefined,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      });

      return {
        success: true,
        message: 'Email templates retrieved successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve email templates',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('templates/:id')
  @Roles(UserRole.ADMIN, UserRole.REVIEWER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update email template (Admin/Reviewer only)' })
  @ApiResponse({
    status: 200,
    description: 'Email template updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin/Reviewer access required',
  })
  @ApiResponse({
    status: 404,
    description: 'Email template not found',
  })
  async updateEmailTemplate(
    @Param('id') id: string,
    @Body() updateData: {
      name?: string;
      subject?: string;
      content?: string;
      variables?: string[];
      category?: string;
      isActive?: boolean;
    },
  ) {
    try {
      const template = await this.communicationsService.updateEmailTemplate(id, updateData);

      return {
        success: true,
        message: 'Email template updated successfully',
        data: template,
      };
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new HttpException(
          {
            success: false,
            message: 'Email template not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          success: false,
          message: 'Failed to update email template',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('templates/:id')
  @Roles(UserRole.ADMIN, UserRole.REVIEWER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete email template (Admin/Reviewer only)' })
  @ApiResponse({
    status: 200,
    description: 'Email template deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin/Reviewer access required',
  })
  @ApiResponse({
    status: 404,
    description: 'Email template not found',
  })
  async deleteEmailTemplate(@Param('id') id: string) {
    try {
      await this.communicationsService.deleteEmailTemplate(id);

      return {
        success: true,
        message: 'Email template deleted successfully',
      };
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new HttpException(
          {
            success: false,
            message: 'Email template not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          success: false,
          message: 'Failed to delete email template',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/schedule')
  @Roles(UserRole.ADMIN, UserRole.REVIEWER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Schedule communication (Admin/Reviewer only)' })
  @ApiResponse({
    status: 200,
    description: 'Communication scheduled successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin/Reviewer access required',
  })
  @ApiResponse({
    status: 404,
    description: 'Communication not found',
  })
  async scheduleCommunication(
    @Param('id') id: string,
    @Body() scheduleData: { scheduledAt: string },
  ) {
    try {
      const communication = await this.communicationsService.scheduleCommunication(
        id,
        new Date(scheduleData.scheduledAt),
      );

      return {
        success: true,
        message: 'Communication scheduled successfully',
        data: communication,
      };
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new HttpException(
          {
            success: false,
            message: 'Communication not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          success: false,
          message: 'Failed to schedule communication',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/cancel')
  @Roles(UserRole.ADMIN, UserRole.REVIEWER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Cancel communication (Admin/Reviewer only)' })
  @ApiResponse({
    status: 200,
    description: 'Communication cancelled successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin/Reviewer access required',
  })
  @ApiResponse({
    status: 404,
    description: 'Communication not found',
  })
  async cancelCommunication(@Param('id') id: string) {
    try {
      const communication = await this.communicationsService.cancelCommunication(id);

      return {
        success: true,
        message: 'Communication cancelled successfully',
        data: communication,
      };
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new HttpException(
          {
            success: false,
            message: 'Communication not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          success: false,
          message: 'Failed to cancel communication',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}