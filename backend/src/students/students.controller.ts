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
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
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

@ApiTags('Students')
@ApiBearerAuth()
@Controller('students')
@UseGuards(JwtAuthGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({
    status: 201,
    description: 'Student created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            isVerified: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        errors: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - student already exists',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  async create(@Body() createStudentDto: CreateStudentDto) {
    try {
      const student = await this.studentsService.create(createStudentDto);
      return {
        success: true,
        message: 'Student created successfully',
        data: student,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException(
          {
            success: false,
            message: 'Student with this email already exists',
          },
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        {
          success: false,
          message: 'Failed to create student',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current student profile' })
  @ApiResponse({
    status: 200,
    description: 'Student profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            dateOfBirth: { type: 'string', format: 'date' },
            gender: { type: 'string' },
            address: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            pincode: { type: 'string' },
            isVerified: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Student profile not found',
  })
  async getProfile(@Req() req: any) {
    try {
      console.log('Profile request - User:', req.user);
      const student = await this.studentsService.findOne(req.user.id, req.user.id, req.user.role);
      if (!student) {
        throw new HttpException(
          {
            success: false,
            message: 'Student profile not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      console.log('Profile response:', { success: true, data: student });
      return {
        success: true,
        message: 'Student profile retrieved successfully',
        data: student,
      };
    } catch (error) {
      console.log('Profile error:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve student profile',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all students with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term' })
  @ApiQuery({ name: 'state', required: false, type: String, description: 'Filter by state' })
  @ApiQuery({ name: 'isVerified', required: false, type: Boolean, description: 'Filter by verification status' })
  @ApiResponse({
    status: 200,
    description: 'Students retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            students: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  email: { type: 'string' },
                  phone: { type: 'string' },
                  city: { type: 'string' },
                  state: { type: 'string' },
                  isVerified: { type: 'boolean' },
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
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('state') state?: string,
    @Query('isVerified') isVerified?: boolean,
  ) {
    try {
      const result = await this.studentsService.findAll({
        page,
        limit,
        search,
        state,
        isVerified,
      });

      return {
        success: true,
        message: 'Students retrieved successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve students',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student by ID' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description: 'Student retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            dateOfBirth: { type: 'string', format: 'date' },
            gender: { type: 'string' },
            address: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            pincode: { type: 'string' },
            aadharNumber: { type: 'string' },
            panNumber: { type: 'string' },
            fatherName: { type: 'string' },
            fatherOccupation: { type: 'string' },
            motherName: { type: 'string' },
            motherOccupation: { type: 'string' },
            familyIncome: { type: 'number' },
            emergencyContact: { type: 'string' },
            isVerified: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  async findOne(@Param('id') id: string, @Req() req: any) {
    try {
      const student = await this.studentsService.findOne(id, req.user.id, req.user.role);
      if (!student) {
        throw new HttpException(
          {
            success: false,
            message: 'Student not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        message: 'Student retrieved successfully',
        data: student,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve student',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update student information' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description: 'Student updated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  async update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto, @Req() req: any) {
    try {
      const student = await this.studentsService.update(id, updateStudentDto, req.user.id, req.user.role);
      if (!student) {
        throw new HttpException(
          {
            success: false,
            message: 'Student not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        message: 'Student updated successfully',
        data: student,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: 'Failed to update student',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete student (Admin only)' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description: 'Student deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async remove(@Param('id') id: string) {
    try {
      const result = await this.studentsService.remove(id);
      if (!result) {
        throw new HttpException(
          {
            success: false,
            message: 'Student not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        message: 'Student deleted successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: 'Failed to delete student',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/applications')
  @ApiOperation({ summary: 'Get student applications' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description: 'Student applications retrieved successfully',
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
              status: { type: 'string' },
              scholarship: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  amount: { type: 'number' },
                },
              },
              submittedAt: { type: 'string', format: 'date-time' },
              reviewedAt: { type: 'string', format: 'date-time' },
              approvedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  })
  async getApplications(@Param('id') id: string) {
    try {
      const applications = await this.studentsService.getApplications(id);
      return {
        success: true,
        message: 'Student applications retrieved successfully',
        data: applications,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve student applications',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/documents')
  @ApiOperation({ summary: 'Get student documents' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description: 'Student documents retrieved successfully',
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
              type: { type: 'string' },
              fileName: { type: 'string' },
              originalName: { type: 'string' },
              fileSize: { type: 'number' },
              mimeType: { type: 'string' },
              isVerified: { type: 'boolean' },
              uploadedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  })
  async getDocuments(@Param('id') id: string) {
    try {
      const documents = await this.studentsService.getDocuments(id);
      return {
        success: true,
        message: 'Student documents retrieved successfully',
        data: documents,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve student documents',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/verify')
  @Roles(UserRole.ADMIN, UserRole.REVIEWER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Verify student profile (Admin/Reviewer only)' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description: 'Student verified successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            isVerified: { type: 'boolean' },
            verifiedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  async verifyStudent(@Param('id') id: string, @Req() req: any) {
    try {
      const student = await this.studentsService.verifyStudent(id, req.user.role);
      if (!student) {
        throw new HttpException(
          {
            success: false,
            message: 'Student not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        message: 'Student verified successfully',
        data: student,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: 'Failed to verify student',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}