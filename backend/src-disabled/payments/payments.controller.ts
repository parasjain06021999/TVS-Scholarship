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
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { DisbursePaymentDto } from './dto/disburse-payment.dto';
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

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.FINANCE_OFFICER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create a new payment record' })
  @ApiResponse({
    status: 201,
    description: 'Payment created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            amount: { type: 'number' },
            status: { type: 'string' },
            paymentMethod: { type: 'string' },
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
    description: 'Forbidden - Admin/Finance Officer access required',
  })
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    try {
      const payment = await this.paymentsService.create(createPaymentDto);
      return {
        success: true,
        message: 'Payment created successfully',
        data: payment,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to create payment',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by status' })
  @ApiQuery({ name: 'studentId', required: false, type: String, description: 'Filter by student' })
  @ApiQuery({ name: 'applicationId', required: false, type: String, description: 'Filter by application' })
  @ApiResponse({
    status: 200,
    description: 'Payments retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            payments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  amount: { type: 'number' },
                  status: { type: 'string' },
                  paymentMethod: { type: 'string' },
                  transactionId: { type: 'string' },
                  paymentDate: { type: 'string', format: 'date-time' },
                  student: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      firstName: { type: 'string' },
                      lastName: { type: 'string' },
                      email: { type: 'string' },
                    },
                  },
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
    @Query('status') status?: string,
    @Query('studentId') studentId?: string,
    @Query('applicationId') applicationId?: string,
  ) {
    try {
      const result = await this.paymentsService.findAll({
        page,
        limit,
        status,
        studentId,
        applicationId,
      });

      return {
        success: true,
        message: 'Payments retrieved successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve payments',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @ApiResponse({
    status: 200,
    description: 'Payment retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Payment not found',
  })
  async findOne(@Param('id') id: string) {
    try {
      const payment = await this.paymentsService.findOne(id);
      if (!payment) {
        throw new HttpException(
          {
            success: false,
            message: 'Payment not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        message: 'Payment retrieved successfully',
        data: payment,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve payment',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('disburse')
  @Roles(UserRole.ADMIN, UserRole.FINANCE_OFFICER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Disburse payment to student' })
  @ApiResponse({
    status: 200,
    description: 'Payment disbursed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin/Finance Officer access required',
  })
  async disbursePayment(@Body() disbursePaymentDto: DisbursePaymentDto) {
    try {
      const result = await this.paymentsService.disbursePayment(disbursePaymentDto);
      return {
        success: true,
        message: 'Payment disbursed successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to disburse payment',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('bulk-disburse')
  @Roles(UserRole.ADMIN, UserRole.FINANCE_OFFICER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Bulk disburse payments to multiple students' })
  @ApiResponse({
    status: 200,
    description: 'Bulk payment disbursed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin/Finance Officer access required',
  })
  async bulkDisbursePayments(@Body() bulkDisburseDto: { paymentIds: string[] }) {
    try {
      const result = await this.paymentsService.bulkDisbursePayments(bulkDisburseDto.paymentIds);
      return {
        success: true,
        message: 'Bulk payment disbursed successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to bulk disburse payments',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.FINANCE_OFFICER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update payment status' })
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @ApiResponse({
    status: 200,
    description: 'Payment status updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Payment not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin/Finance Officer access required',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('remarks') remarks?: string,
  ) {
    try {
      const payment = await this.paymentsService.updateStatus(id, status, remarks);
      if (!payment) {
        throw new HttpException(
          {
            success: false,
            message: 'Payment not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        message: 'Payment status updated successfully',
        data: payment,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: 'Failed to update payment status',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('stats/overview')
  @ApiOperation({ summary: 'Get payment statistics overview' })
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
            pending: { type: 'number' },
            processing: { type: 'number' },
            completed: { type: 'number' },
            failed: { type: 'number' },
            totalAmount: { type: 'number' },
            disbursedAmount: { type: 'number' },
            averageAmount: { type: 'number' },
          },
        },
      },
    },
  })
  async getStats() {
    try {
      const stats = await this.paymentsService.getStats();
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

  @Get('export/csv')
  @Roles(UserRole.ADMIN, UserRole.FINANCE_OFFICER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Export payments to CSV' })
  @ApiResponse({
    status: 200,
    description: 'CSV export generated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin/Finance Officer access required',
  })
  async exportToCSV(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    try {
      const csvData = await this.paymentsService.exportToCSV(startDate, endDate);
      return {
        success: true,
        message: 'CSV export generated successfully',
        data: csvData,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to export CSV',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
