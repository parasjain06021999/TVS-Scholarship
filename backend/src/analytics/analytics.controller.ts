import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
@UseGuards(AuthGuard('jwt'))
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('distribution/state')
  async getStateDistribution(@Request() req, @Query() query: any) {
    return this.analyticsService.getStateDistribution(query);
  }

  @Get('distribution/district')
  async getDistrictDistribution(@Request() req, @Query() query: any) {
    return this.analyticsService.getDistrictDistribution(query);
  }

  @Get('distribution/gender')
  async getGenderDistribution(@Request() req, @Query() query: any) {
    return this.analyticsService.getGenderDistribution(query);
  }

  @Get('distribution/class')
  async getClassDistribution(@Request() req, @Query() query: any) {
    return this.analyticsService.getClassDistribution(query);
  }

  @Get('distribution/degree')
  async getDegreeDistribution(@Request() req, @Query() query: any) {
    return this.analyticsService.getDegreeDistribution(query);
  }

  @Get('distribution/occupation')
  async getOccupationDistribution(@Request() req, @Query() query: any) {
    return this.analyticsService.getOccupationDistribution(query);
  }

  @Get('distribution/income')
  async getIncomeDistribution(@Request() req, @Query() query: any) {
    return this.analyticsService.getIncomeDistribution(query);
  }

  @Get('distribution/institute')
  async getInstituteDistribution(@Request() req, @Query() query: any) {
    return this.analyticsService.getInstituteDistribution(query);
  }

  @Get('overview')
  async getAnalyticsOverview(@Request() req, @Query() query: any) {
    try {
      const data = await this.analyticsService.getAnalyticsOverview(query);
      return {
        success: true,
        data,
        message: 'Analytics data retrieved successfully'
      };
    } catch (error) {
      console.error('Error in analytics overview:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to retrieve analytics data',
        error: error.message
      };
    }
  }
}
