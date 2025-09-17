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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Documents')
@ApiBearerAuth()
@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Document upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        type: {
          type: 'string',
          enum: ['PHOTOGRAPH', 'AADHAR_CARD', 'PAN_CARD', 'MARK_SHEET_10TH', 'MARK_SHEET_12TH', 'DEGREE_CERTIFICATE', 'INCOME_CERTIFICATE', 'BANK_PASSBOOK'],
        },
        studentId: {
          type: 'string',
        },
        applicationId: {
          type: 'string',
        },
      },
      required: ['file', 'type', 'studentId'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Document uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            fileName: { type: 'string' },
            originalName: { type: 'string' },
            filePath: { type: 'string' },
            fileSize: { type: 'number' },
            mimeType: { type: 'string' },
            status: { type: 'string' },
            uploadedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: string,
    @Body('studentId') studentId: string,
    @Body('applicationId') applicationId?: string,
  ) {
    try {
      if (!file) {
        throw new HttpException(
          {
            success: false,
            message: 'No file uploaded',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const document = await this.documentsService.uploadDocument({
        file,
        type,
        studentId,
        applicationId,
      });

      return {
        success: true,
        message: 'Document uploaded successfully',
        data: document,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: 'Failed to upload document',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'Documents retrieved successfully',
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('studentId') studentId?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
  ) {
    try {
      const result = await this.documentsService.findAll({
        page,
        limit,
        studentId,
        type,
        status,
      });

      return {
        success: true,
        message: 'Documents retrieved successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve documents',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID' })
  @ApiResponse({
    status: 200,
    description: 'Document retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Document not found',
  })
  async findOne(@Param('id') id: string) {
    try {
      const document = await this.documentsService.findOne(id);
      if (!document) {
        throw new HttpException(
          {
            success: false,
            message: 'Document not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        message: 'Document retrieved successfully',
        data: document,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve document',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/verify')
  @Roles(UserRole.ADMIN, UserRole.REVIEWER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Verify document (Admin/Reviewer only)' })
  @ApiResponse({
    status: 200,
    description: 'Document verified successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Document not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin/Reviewer access required',
  })
  async verifyDocument(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('verificationNotes') verificationNotes?: string,
  ) {
    try {
      const document = await this.documentsService.verifyDocument(id, status, verificationNotes);
      if (!document) {
        throw new HttpException(
          {
            success: false,
            message: 'Document not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        message: 'Document verification updated successfully',
        data: document,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: 'Failed to verify document',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete document (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Document deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Document not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async remove(@Param('id') id: string) {
    try {
      const result = await this.documentsService.remove(id);
      if (!result) {
        throw new HttpException(
          {
            success: false,
            message: 'Document not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        message: 'Document deleted successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: 'Failed to delete document',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('stats/overview')
  @ApiOperation({ summary: 'Get document statistics overview' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStats() {
    try {
      const stats = await this.documentsService.getStats();
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
}
