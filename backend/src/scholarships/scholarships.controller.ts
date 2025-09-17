import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpException,
  Req,
} from '@nestjs/common';
import { ScholarshipsService } from './scholarships.service';
import { CreateScholarshipDto } from './dto/create-scholarship.dto';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto';
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
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Scholarships')
@ApiBearerAuth()
@Controller('scholarships')
@UseGuards(JwtAuthGuard)
export class ScholarshipsController {
  constructor(private readonly scholarshipsService: ScholarshipsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create a new scholarship (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Scholarship created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            amount: { type: 'number' },
            category: { type: 'string' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async create(@Body() createScholarshipDto: CreateScholarshipDto, @Req() req: any) {
    try {
      const scholarship = await this.scholarshipsService.create(createScholarshipDto, req.user.id);
      return {
        success: true,
        message: 'Scholarship created successfully',
        data: scholarship,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: 'Failed to create scholarship',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all scholarships with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'category', required: false, type: String, description: 'Filter by category' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term' })
  @ApiQuery({ name: 'minAmount', required: false, type: Number, description: 'Minimum amount filter' })
  @ApiQuery({ name: 'maxAmount', required: false, type: Number, description: 'Maximum amount filter' })
  @ApiResponse({
    status: 200,
    description: 'Scholarships retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            scholarships: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  description: { type: 'string' },
                  amount: { type: 'number' },
                  maxAmount: { type: 'number' },
                  category: { type: 'string' },
                  subCategory: { type: 'string' },
                  applicationStartDate: { type: 'string', format: 'date-time' },
                  applicationEndDate: { type: 'string', format: 'date-time' },
                  academicYear: { type: 'string' },
                  isActive: { type: 'boolean' },
                  maxApplications: { type: 'number' },
                  currentApplications: { type: 'number' },
                  createdAt: { type: 'string', format: 'date-time' },
                },
              },
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number' },
                limit: { type: 'number' },
                total: { type: 'number' },
                totalPages: { type: 'number' },
                hasNext: { type: 'boolean' },
                hasPrev: { type: 'boolean' },
              },
            },
          },
        },
      },
    },
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('category') category?: string,
    @Query('isActive') isActive?: boolean,
    @Query('search') search?: string,
    @Query('minAmount') minAmount?: number,
    @Query('maxAmount') maxAmount?: number,
  ) {
    try {
      const result = await this.scholarshipsService.findAll({
        page,
        limit,
        category,
        isActive,
        search,
        minAmount,
        maxAmount,
      });

      return {
        success: true,
        message: 'Scholarships retrieved successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve scholarships',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active scholarships' })
  @ApiResponse({
    status: 200,
    description: 'Active scholarships retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              description: { type: 'string' },
              amount: { type: 'number' },
              category: { type: 'string' },
              applicationEndDate: { type: 'string', format: 'date-time' },
              isActive: { type: 'boolean' },
            },
          },
        },
      },
    },
  })
  async findActive() {
    try {
      const scholarships = await this.scholarshipsService.findActive();
      return {
        success: true,
        message: 'Active scholarships retrieved successfully',
        data: scholarships,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve active scholarships',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get scholarship by ID' })
  @ApiParam({ name: 'id', description: 'Scholarship ID' })
  @ApiResponse({
    status: 200,
    description: 'Scholarship retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            eligibilityCriteria: { type: 'string' },
            amount: { type: 'number' },
            maxAmount: { type: 'number' },
            minAmount: { type: 'number' },
            category: { type: 'string' },
            subCategory: { type: 'string' },
            applicationStartDate: { type: 'string', format: 'date-time' },
            applicationEndDate: { type: 'string', format: 'date-time' },
            academicYear: { type: 'string' },
            isActive: { type: 'boolean' },
            maxApplications: { type: 'number' },
            currentApplications: { type: 'number' },
            requirements: { type: 'object' },
            documentsRequired: { type: 'array', items: { type: 'string' } },
            priority: { type: 'number' },
            createdBy: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Scholarship not found',
  })
  async findOne(@Param('id') id: string) {
    try {
      const scholarship = await this.scholarshipsService.findOne(id);
      if (!scholarship) {
        throw new HttpException(
          {
            success: false,
            message: 'Scholarship not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        message: 'Scholarship retrieved successfully',
        data: scholarship,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve scholarship',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update scholarship (Admin only)' })
  @ApiParam({ name: 'id', description: 'Scholarship ID' })
  @ApiResponse({
    status: 200,
    description: 'Scholarship updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Scholarship not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async update(@Param('id') id: string, @Body() updateScholarshipDto: UpdateScholarshipDto) {
    try {
      const scholarship = await this.scholarshipsService.update(id, updateScholarshipDto);
      if (!scholarship) {
        throw new HttpException(
          {
            success: false,
            message: 'Scholarship not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        message: 'Scholarship updated successfully',
        data: scholarship,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: 'Failed to update scholarship',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete scholarship (Admin only)' })
  @ApiParam({ name: 'id', description: 'Scholarship ID' })
  @ApiResponse({
    status: 200,
    description: 'Scholarship deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Scholarship not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async remove(@Param('id') id: string) {
    try {
      const result = await this.scholarshipsService.remove(id);
      if (!result) {
        throw new HttpException(
          {
            success: false,
            message: 'Scholarship not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        message: 'Scholarship deleted successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: 'Failed to delete scholarship',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/applications')
  @ApiOperation({ summary: 'Get applications for a specific scholarship' })
  @ApiParam({ name: 'id', description: 'Scholarship ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by status' })
  @ApiResponse({
    status: 200,
    description: 'Scholarship applications retrieved successfully',
  })
  async getApplications(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
  ) {
    try {
      const result = await this.scholarshipsService.getApplications(id, {
        page,
        limit,
        status,
      });

      return {
        success: true,
        message: 'Scholarship applications retrieved successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve scholarship applications',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('stats/overview')
  @ApiOperation({ summary: 'Get scholarship statistics overview' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            active: { type: 'number' },
            inactive: { type: 'number' },
            totalApplications: { type: 'number' },
            totalAmount: { type: 'number' },
            averageAmount: { type: 'number' },
            categoryBreakdown: {
              type: 'object',
              additionalProperties: { type: 'number' },
            },
          },
        },
      },
    },
  })
  async getStats() {
    try {
      const stats = await this.scholarshipsService.getStats();
      return {
        success: true,
        message: 'Statistics retrieved successfully',
        data: stats,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve statistics',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('check-eligibility')
  @ApiOperation({ summary: 'Check student eligibility for scholarships' })
  @ApiResponse({
    status: 200,
    description: 'Eligibility checked successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            eligibleScholarships: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  amount: { type: 'number' },
                  eligibilityScore: { type: 'number' },
                  reasons: { type: 'array', items: { type: 'string' } },
                },
              },
            },
            ineligibleScholarships: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  reasons: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          },
        },
      },
    },
  })
  async checkEligibility(@Body() eligibilityData: any) {
    try {
      const result = await this.scholarshipsService.checkEligibility(eligibilityData);
      return {
        success: true,
        message: 'Eligibility checked successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to check eligibility',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/toggle-status')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Toggle scholarship active status (Admin only)' })
  @ApiParam({ name: 'id', description: 'Scholarship ID' })
  @ApiResponse({
    status: 200,
    description: 'Scholarship status toggled successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Scholarship not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async toggleStatus(@Param('id') id: string) {
    try {
      const scholarship = await this.scholarshipsService.toggleStatus(id);
      if (!scholarship) {
        throw new HttpException(
          {
            success: false,
            message: 'Scholarship not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        message: `Scholarship ${scholarship.isActive ? 'activated' : 'deactivated'} successfully`,
        data: scholarship,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: 'Failed to toggle scholarship status',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
