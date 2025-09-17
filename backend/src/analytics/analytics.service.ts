import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getStateDistribution(filters?: any) {
    const applications = await this.getApplicationsWithFilters(filters);
    
    const stateCount: Record<string, number> = {};
    applications.forEach(app => {
      const state = app.student?.state || 'Unknown';
      stateCount[state] = (stateCount[state] || 0) + 1;
    });

    return Object.entries(stateCount).map(([state, count]) => ({ state, count }));
  }

  async getDistrictDistribution(filters?: any) {
    const applications = await this.getApplicationsWithFilters(filters);
    
    const districtCount: Record<string, number> = {};
    applications.forEach(app => {
      const district = app.student?.city || 'Unknown';
      districtCount[district] = (districtCount[district] || 0) + 1;
    });

    return Object.entries(districtCount).map(([district, count]) => ({ district, count }));
  }

  async getGenderDistribution(filters?: any) {
    const applications = await this.getApplicationsWithFilters(filters);
    
    const genderCount: Record<string, number> = {};
    applications.forEach(app => {
      const applicationData = app.applicationData as any;
      const gender = applicationData?.personalInfo?.gender || 'Unknown';
      genderCount[gender] = (genderCount[gender] || 0) + 1;
    });

    return Object.entries(genderCount).map(([gender, count]) => ({ gender, count }));
  }

  async getClassDistribution(filters?: any) {
    const applications = await this.getApplicationsWithFilters(filters);
    
    const classCount: Record<string, number> = {};
    applications.forEach(app => {
      const applicationData = app.applicationData as any;
      const currentYear = applicationData?.educationInfo?.currentYear;
      const classType = currentYear ? `Year ${currentYear}` : 'Unknown';
      classCount[classType] = (classCount[classType] || 0) + 1;
    });

    return Object.entries(classCount).map(([classType, count]) => ({ class: classType, count }));
  }

  async getDegreeDistribution(filters?: any) {
    const applications = await this.getApplicationsWithFilters(filters);
    
    const degreeCount: Record<string, number> = {};
    applications.forEach(app => {
      const applicationData = app.applicationData as any;
      const course = applicationData?.educationInfo?.currentCourse || 'Unknown';
      degreeCount[course] = (degreeCount[course] || 0) + 1;
    });

    return Object.entries(degreeCount).map(([degree, count]) => ({ degree, count }));
  }

  async getOccupationDistribution(filters?: any) {
    const applications = await this.getApplicationsWithFilters(filters);
    
    const occupationCount: Record<string, number> = {};
    applications.forEach(app => {
      const applicationData = app.applicationData as any;
      const occupation = applicationData?.familyInfo?.fatherOccupation || 'Unknown';
      occupationCount[occupation] = (occupationCount[occupation] || 0) + 1;
    });

    return Object.entries(occupationCount).map(([occupation, count]) => ({ occupation, count }));
  }

  async getIncomeDistribution(filters?: any) {
    const applications = await this.getApplicationsWithFilters(filters);
    
    const incomeCount: Record<string, number> = {};
    applications.forEach(app => {
      const applicationData = app.applicationData as any;
      const income = applicationData?.familyInfo?.fatherIncome || 0;
      const incomeRange = this.getIncomeRange(income);
      incomeCount[incomeRange] = (incomeCount[incomeRange] || 0) + 1;
    });

    return Object.entries(incomeCount).map(([incomeRange, count]) => ({ incomeRange, count }));
  }

  async getInstituteDistribution(filters?: any) {
    const applications = await this.getApplicationsWithFilters(filters);
    
    const instituteCount: Record<string, number> = {};
    applications.forEach(app => {
      const applicationData = app.applicationData as any;
      const institute = applicationData?.educationInfo?.currentInstitution || 'Unknown';
      const instituteType = this.getInstituteType(institute);
      instituteCount[instituteType] = (instituteCount[instituteType] || 0) + 1;
    });

    return Object.entries(instituteCount).map(([type, count]) => ({ type, count }));
  }

  async getAnalyticsOverview(filters?: any) {
    const applications = await this.getApplicationsWithFilters(filters);
    
    return {
      totalApplications: applications.length,
      stateDistribution: await this.getStateDistribution(filters),
      districtDistribution: await this.getDistrictDistribution(filters),
      genderDistribution: await this.getGenderDistribution(filters),
      classDistribution: await this.getClassDistribution(filters),
      degreeDistribution: await this.getDegreeDistribution(filters),
      occupationDistribution: await this.getOccupationDistribution(filters),
      incomeDistribution: await this.getIncomeDistribution(filters),
      instituteDistribution: await this.getInstituteDistribution(filters),
    };
  }

  private async getApplicationsWithFilters(filters?: any) {
    try {
      const where: any = {};
      
      if (filters?.status) {
        where.status = filters.status;
      }

      const applications = await this.prisma.application.findMany({
        where,
        include: {
          student: true,
          scholarship: true,
        },
      });

      return applications || [];
    } catch (error) {
      console.error('Error fetching applications for analytics:', error);
      return [];
    }
  }

  private getIncomeRange(income: number): string {
    if (income < 100000) return '<1 L';
    if (income < 200000) return '1L-2L';
    if (income < 300000) return '2L-3L';
    if (income < 400000) return '3L-4L';
    if (income < 500000) return '4L-5L';
    return '>5L';
  }

  private getInstituteType(institute: string): string {
    if (institute.toLowerCase().includes('government') || institute.toLowerCase().includes('govt')) {
      return 'Government';
    }
    if (institute.toLowerCase().includes('aided')) {
      return 'Government Aided';
    }
    return 'Private';
  }
}
