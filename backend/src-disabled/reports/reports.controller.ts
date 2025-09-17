import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  HttpStatus,
  HttpException,
  Res,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
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
import { Response } from 'express';

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('applications')
  @Roles(UserRole.ADMIN, UserRole.REVIEWER, UserRole.FINANCE_OFFICER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Generate application report (Admin/Reviewer/Finance Officer only)' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'End date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'state', required: false, type: String, description: 'Filter by state' })
  @ApiQuery({ name: 'scholarshipId', required: false, type: String, description: 'Filter by scholarship ID' })
  @ApiQuery({ name: 'applicationStatus', required: false, type: String, description: 'Filter by application status' })
  @ApiQuery({ name: 'gender', required: false, type: String, description: 'Filter by gender' })
  @ApiQuery({ name: 'category', required: false, type: String, description: 'Filter by category' })
  @ApiResponse({
    status: 200,
    description: 'Application report generated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin/Reviewer/Finance Officer access required',
  })
  async generateApplicationReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('state') state?: string,
    @Query('scholarshipId') scholarshipId?: string,
    @Query('applicationStatus') applicationStatus?: string,
    @Query('gender') gender?: string,
    @Query('category') category?: string,
  ) {
    try {
      const filters = {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        state,
        scholarshipId,
        applicationStatus,
        gender,
        category,
      };

      const report = await this.reportsService.generateApplicationReport(filters);

      return {
        success: true,
        message: 'Application report generated successfully',
        data: report,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to generate application report',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('scholarships/:id')
  @Roles(UserRole.ADMIN, UserRole.REVIEWER, UserRole.FINANCE_OFFICER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Generate scholarship report (Admin/Reviewer/Finance Officer only)' })
  @ApiResponse({
    status: 200,
    description: 'Scholarship report generated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin/Reviewer/Finance Officer access required',
  })
  @ApiResponse({
    status: 404,
    description: 'Scholarship not found',
  })
  async generateScholarshipReport(@Query('id') id: string) {
    try {
      const report = await this.reportsService.generateScholarshipReport(id);

      return {
        success: true,
        message: 'Scholarship report generated successfully',
        data: report,
      };
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new HttpException(
          {
            success: false,
            message: 'Scholarship not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          success: false,
          message: 'Failed to generate scholarship report',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('financial')
  @Roles(UserRole.ADMIN, UserRole.FINANCE_OFFICER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Generate financial report (Admin/Finance Officer only)' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'End date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'state', required: false, type: String, description: 'Filter by state' })
  @ApiQuery({ name: 'scholarshipId', required: false, type: String, description: 'Filter by scholarship ID' })
  @ApiResponse({
    status: 200,
    description: 'Financial report generated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin/Finance Officer access required',
  })
  async generateFinancialReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('state') state?: string,
    @Query('scholarshipId') scholarshipId?: string,
  ) {
    try {
      const filters = {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        state,
        scholarshipId,
      };

      const report = await this.reportsService.generateFinancialReport(filters);

      return {
        success: true,
        message: 'Financial report generated successfully',
        data: report,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to generate financial report',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('demographics')
  @Roles(UserRole.ADMIN, UserRole.REVIEWER, UserRole.FINANCE_OFFICER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Generate demographic report (Admin/Reviewer/Finance Officer only)' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'End date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'state', required: false, type: String, description: 'Filter by state' })
  @ApiQuery({ name: 'scholarshipId', required: false, type: String, description: 'Filter by scholarship ID' })
  @ApiQuery({ name: 'gender', required: false, type: String, description: 'Filter by gender' })
  @ApiQuery({ name: 'category', required: false, type: String, description: 'Filter by category' })
  @ApiResponse({
    status: 200,
    description: 'Demographic report generated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin/Reviewer/Finance Officer access required',
  })
  async generateDemographicReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('state') state?: string,
    @Query('scholarshipId') scholarshipId?: string,
    @Query('gender') gender?: string,
    @Query('category') category?: string,
  ) {
    try {
      const filters = {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        state,
        scholarshipId,
        gender,
        category,
      };

      const report = await this.reportsService.generateDemographicReport(filters);

      return {
        success: true,
        message: 'Demographic report generated successfully',
        data: report,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to generate demographic report',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('performance')
  @Roles(UserRole.ADMIN, UserRole.REVIEWER, UserRole.FINANCE_OFFICER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Generate performance report (Admin/Reviewer/Finance Officer only)' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'End date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'state', required: false, type: String, description: 'Filter by state' })
  @ApiQuery({ name: 'scholarshipId', required: false, type: String, description: 'Filter by scholarship ID' })
  @ApiResponse({
    status: 200,
    description: 'Performance report generated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin/Reviewer/Finance Officer access required',
  })
  async generatePerformanceReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('state') state?: string,
    @Query('scholarshipId') scholarshipId?: string,
  ) {
    try {
      const filters = {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        state,
        scholarshipId,
      };

      const report = await this.reportsService.generatePerformanceReport(filters);

      return {
        success: true,
        message: 'Performance report generated successfully',
        data: report,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to generate performance report',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('export')
  @Roles(UserRole.ADMIN, UserRole.REVIEWER, UserRole.FINANCE_OFFICER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Export report data (Admin/Reviewer/Finance Officer only)' })
  @ApiResponse({
    status: 200,
    description: 'Report exported successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin/Reviewer/Finance Officer access required',
  })
  async exportReport(
    @Body() exportData: {
      reportType: 'applications' | 'scholarships' | 'financial' | 'demographics' | 'performance';
      format: 'CSV' | 'EXCEL' | 'PDF';
      filters: {
        startDate?: string;
        endDate?: string;
        state?: string;
        scholarshipId?: string;
        applicationStatus?: string;
        gender?: string;
        category?: string;
      };
    },
    @Res() res: Response,
  ) {
    try {
      const { reportType, format, filters } = exportData;

      const processedFilters = {
        startDate: filters.startDate ? new Date(filters.startDate) : undefined,
        endDate: filters.endDate ? new Date(filters.endDate) : undefined,
        state: filters.state,
        scholarshipId: filters.scholarshipId,
        applicationStatus: filters.applicationStatus,
        gender: filters.gender,
        category: filters.category,
      };

      const buffer = await this.reportsService.exportReport(reportType, processedFilters, format);

      // Set appropriate headers based on format
      const contentType = {
        CSV: 'text/csv',
        EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        PDF: 'application/pdf',
      };

      const fileExtension = {
        CSV: 'csv',
        EXCEL: 'xlsx',
        PDF: 'pdf',
      };

      res.set({
        'Content-Type': contentType[format],
        'Content-Disposition': `attachment; filename="report.${fileExtension[format]}"`,
        'Content-Length': buffer.length.toString(),
      });

      res.send(buffer);
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to export report',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('dashboard')
  @Roles(UserRole.ADMIN, UserRole.REVIEWER, UserRole.FINANCE_OFFICER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get dashboard data (Admin/Reviewer/Finance Officer only)' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard data retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin/Reviewer/Finance Officer access required',
  })
  async getDashboardData() {
    try {
      // Get data for the last 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const filters = { startDate, endDate };

      const [applicationReport, financialReport, demographicReport, performanceReport] = await Promise.all([
        this.reportsService.generateApplicationReport(filters),
        this.reportsService.generateFinancialReport(filters),
        this.reportsService.generateDemographicReport(filters),
        this.reportsService.generatePerformanceReport(filters),
      ]);

      const dashboardData = {
        summary: applicationReport.summary,
        trends: applicationReport.trends,
        demographics: demographicReport,
        performance: performanceReport,
        financial: financialReport.summary,
        lastUpdated: new Date().toISOString(),
      };

      return {
        success: true,
        message: 'Dashboard data retrieved successfully',
        data: dashboardData,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve dashboard data',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
