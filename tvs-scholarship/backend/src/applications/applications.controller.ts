import { Controller, Get, Post, Body, UseGuards, Request, Query, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ReviewApplicationDto } from './dto/review-application.dto';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Request() req, @Query() query: any) {
    try {
      const { page = 1, limit = 10, status, scholarshipId } = query;

      console.log('Fetching applications for user:', req.user.id, 'role:', req.user.role);

      let result;
      // If user is student, only show their applications
      if (req.user.role === 'STUDENT') {
        result = await this.applicationsService.findByStudent(req.user.id, { page, limit, status });
      } else {
        // If user is admin/reviewer, show all applications
        result = await this.applicationsService.findAll({ page, limit, status, scholarshipId });
      }

      console.log('Applications result:', result);

      return {
        success: true,
        message: 'Applications retrieved successfully',
        data: result
      };
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createApplicationDto: CreateApplicationDto, @Request() req) {
    try {
      console.log('=== APPLICATION CREATION REQUEST ===');
      console.log('Request body:', JSON.stringify(createApplicationDto, null, 2));
      console.log('User from request:', req.user);
      console.log('User ID:', req.user?.id);

      if (!req.user || !req.user.id) {
        throw new Error('User not authenticated or user ID missing');
      }

      if (!createApplicationDto.scholarshipId) {
        throw new Error('Scholarship ID is required');
      }

      const application = await this.applicationsService.create(createApplicationDto, req.user.id);

      console.log('Application created successfully:', application.id);

      return {
        success: true,
        message: 'Application submitted successfully',
        applicationId: application.id,
        data: application
      };
    } catch (error) {
      console.error('=== APPLICATION CREATION ERROR ===');
      console.error('Error details:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);

      // Handle specific error types
      if (error.message && error.message.includes('Application already exists')) {
        return {
          success: false,
          message: 'You have already applied for this scholarship',
          error: 'DUPLICATE_APPLICATION',
          details: error.message
        };
      }

      if (error.code === 'P2002') {
        return {
          success: false,
          message: 'You have already applied for this scholarship',
          error: 'DUPLICATE_APPLICATION',
          details: 'Unique constraint failed - application already exists'
        };
      }

      // Return a proper error response
      return {
        success: false,
        message: error.message || 'Failed to create application',
        error: error.message,
        details: error.stack
      };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/review')
  async review(
    @Param('id') id: string,
    @Body() reviewApplicationDto: ReviewApplicationDto,
    @Request() req
  ) {
    return this.applicationsService.review(id, reviewApplicationDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/approve')
  async approve(@Param('id') id: string, @Request() req) {
    return this.applicationsService.approveApplication(id, 'Approved by admin');
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/reject')
  async reject(@Param('id') id: string, @Body() body: { rejectionReason?: string }, @Request() req) {
    return this.applicationsService.rejectApplication(id, body.rejectionReason || 'Rejected by admin');
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('stats/overview')
  async getStats(@Request() req) {
    return this.applicationsService.getStats();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/feedback')
  async sendFeedback(
    @Param('id') id: string,
    @Body() body: {
      type: 'GENERAL' | 'DOCUMENT_REQUEST' | 'INFORMATION_REQUEST' | 'CLARIFICATION';
      message: string;
    },
    @Request() req
  ) {
    try {
      console.log('Feedback sent for application:', id);
      console.log('Feedback type:', body.type);
      console.log('Feedback message:', body.message);
      console.log('Sent by:', req.user.id);

      return {
        success: true,
        message: 'Feedback sent successfully',
        data: {
          applicationId: id,
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

