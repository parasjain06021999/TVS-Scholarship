import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  async createPayment(@Body() body: any, @Req() req: any) {
    return this.paymentsService.createPayment(body, req.user.id);
  }

  @Post('disburse')
  @ApiOperation({ summary: 'Disburse payment to student' })
  @ApiResponse({ status: 201, description: 'Payment disbursed successfully' })
  async disbursePayment(@Body() body: any, @Req() req: any) {
    return this.paymentsService.disbursePayment(body, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully' })
  async getPayments(@Query() query: any, @Req() req: any) {
    return this.paymentsService.getPayments(query, req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully' })
  async getPayment(@Param('id') id: string, @Req() req: any) {
    return this.paymentsService.getPayment(id, req.user);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update payment status' })
  @ApiResponse({ status: 200, description: 'Payment status updated successfully' })
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body() body: { status: string; notes?: string },
    @Req() req: any,
  ) {
    return this.paymentsService.updatePaymentStatus(id, body.status, body.notes, req.user.id);
  }

  @Get('export/csv')
  @ApiOperation({ summary: 'Export payments to CSV' })
  @ApiResponse({ status: 200, description: 'CSV export generated successfully' })
  async exportPaymentsCSV(@Query() query: any, @Req() req: any) {
    return this.paymentsService.exportPaymentsCSV(query, req.user);
  }
}
