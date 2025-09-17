import { Controller, Get, Post, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReportsService } from './reports.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard stats retrieved successfully' })
  async getDashboardStats(@Query() query: any, @Req() req: any) {
    return this.reportsService.getDashboardStats(query, req.user);
  }

  @Get('applications')
  @ApiOperation({ summary: 'Get application analytics' })
  @ApiResponse({ status: 200, description: 'Application analytics retrieved successfully' })
  async getApplicationAnalytics(@Query() query: any, @Req() req: any) {
    return this.reportsService.getApplicationAnalytics(query, req.user);
  }

  @Get('scholarships')
  @ApiOperation({ summary: 'Get scholarship analytics' })
  @ApiResponse({ status: 200, description: 'Scholarship analytics retrieved successfully' })
  async getScholarshipAnalytics(@Query() query: any, @Req() req: any) {
    return this.reportsService.getScholarshipAnalytics(query, req.user);
  }

  @Get('payments')
  @ApiOperation({ summary: 'Get payment analytics' })
  @ApiResponse({ status: 200, description: 'Payment analytics retrieved successfully' })
  async getPaymentAnalytics(@Query() query: any, @Req() req: any) {
    return this.reportsService.getPaymentAnalytics(query, req.user);
  }

  @Get('students')
  @ApiOperation({ summary: 'Get student analytics' })
  @ApiResponse({ status: 200, description: 'Student analytics retrieved successfully' })
  async getStudentAnalytics(@Query() query: any, @Req() req: any) {
    return this.reportsService.getStudentAnalytics(query, req.user);
  }

  @Get('export/:type')
  @ApiOperation({ summary: 'Export report data' })
  @ApiResponse({ status: 200, description: 'Report exported successfully' })
  async exportReport(@Query() query: any, @Req() req: any) {
    return this.reportsService.exportReport(query, req.user);
  }
}
