import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ReportFilters {
  startDate?: Date;
  endDate?: Date;
  state?: string;
  scholarshipId?: string;
  applicationStatus?: string;
  userRole?: string;
  gender?: string;
  category?: string;
}

export interface ReportData {
  summary: {
    totalApplications: number;
    approvedApplications: number;
    rejectedApplications: number;
    pendingApplications: number;
    totalAmount: number;
    disbursedAmount: number;
    pendingAmount: number;
  };
  trends: {
    applicationsOverTime: Array<{ date: string; count: number }>;
    approvalsOverTime: Array<{ date: string; count: number }>;
    disbursementsOverTime: Array<{ date: string; amount: number }>;
  };
  demographics: {
    byState: Array<{ state: string; count: number; percentage: number }>;
    byGender: Array<{ gender: string; count: number; percentage: number }>;
    byCategory: Array<{ category: string; count: number; percentage: number }>;
    byEducation: Array<{ education: string; count: number; percentage: number }>;
  };
  performance: {
    averageProcessingTime: number;
    approvalRate: number;
    rejectionRate: number;
    topPerformingStates: Array<{ state: string; count: number; rate: number }>;
  };
}

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generate comprehensive application report
   */
  async generateApplicationReport(filters: ReportFilters): Promise<ReportData> {
    const where = this.buildWhereClause(filters);

    const [
      applications,
      approvedApplications,
      rejectedApplications,
      pendingApplications,
      payments,
    ] = await Promise.all([
      this.prisma.application.findMany({
        where,
        include: {
          student: true,
          scholarship: true,
          payments: true,
        },
      }),
      this.prisma.application.findMany({
        where: { ...where, status: 'APPROVED' },
        include: { student: true, scholarship: true },
      }),
      this.prisma.application.findMany({
        where: { ...where, status: 'REJECTED' },
        include: { student: true, scholarship: true },
      }),
      this.prisma.application.findMany({
        where: { ...where, status: { in: ['PENDING', 'UNDER_REVIEW'] } },
        include: { student: true, scholarship: true },
      }),
      this.prisma.payment.findMany({
        where: {
          application: where,
          status: 'COMPLETED',
        },
      }),
    ]);

    const summary = this.calculateSummary(
      applications,
      approvedApplications,
      rejectedApplications,
      pendingApplications,
      payments,
    );

    const trends = await this.calculateTrends(filters);
    const demographics = this.calculateDemographics(applications);
    const performance = this.calculatePerformance(applications, approvedApplications, rejectedApplications);

    return {
      summary,
      trends,
      demographics,
      performance,
    };
  }

  /**
   * Generate scholarship performance report
   */
  async generateScholarshipReport(scholarshipId: string): Promise<any> {
    const scholarship = await this.prisma.scholarship.findUnique({
      where: { id: scholarshipId },
      include: {
        applications: {
          include: {
            student: true,
            payments: true,
          },
        },
      },
    });

    if (!scholarship) {
      throw new Error('Scholarship not found');
    }

    const applications = scholarship.applications;
    const approvedApplications = applications.filter(app => app.status === 'APPROVED');
    const totalAmount = applications.reduce((sum, app) => sum + app.scholarship.amount, 0);
    const disbursedAmount = applications.reduce((sum, app) => {
      return sum + app.payments.reduce((paymentSum, payment) => {
        return paymentSum + (payment.status === 'COMPLETED' ? payment.amount : 0);
      }, 0);
    }, 0);

    return {
      scholarship: {
        id: scholarship.id,
        title: scholarship.title,
        amount: scholarship.amount,
        category: scholarship.category,
        isActive: scholarship.isActive,
      },
      metrics: {
        totalApplications: applications.length,
        approvedApplications: approvedApplications.length,
        approvalRate: applications.length > 0 ? (approvedApplications.length / applications.length) * 100 : 0,
        totalAmount,
        disbursedAmount,
        remainingAmount: totalAmount - disbursedAmount,
      },
      applications: applications.map(app => ({
        id: app.id,
        studentName: `${app.student.firstName} ${app.student.lastName}`,
        status: app.status,
        submittedAt: app.submittedAt,
        amount: app.scholarship.amount,
        disbursedAmount: app.payments.reduce((sum, payment) => {
          return sum + (payment.status === 'COMPLETED' ? payment.amount : 0);
        }, 0),
      })),
    };
  }

  /**
   * Generate financial report
   */
  async generateFinancialReport(filters: ReportFilters): Promise<any> {
    const where = this.buildWhereClause(filters);

    const payments = await this.prisma.payment.findMany({
      where: {
        application: where,
      },
      include: {
        application: {
          include: {
            student: true,
            scholarship: true,
          },
        },
      },
    });

    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const completedPayments = payments.filter(payment => payment.status === 'COMPLETED');
    const pendingPayments = payments.filter(payment => payment.status === 'PENDING');
    const failedPayments = payments.filter(payment => payment.status === 'FAILED');

    const completedAmount = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const pendingAmount = pendingPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const failedAmount = failedPayments.reduce((sum, payment) => sum + payment.amount, 0);

    return {
      summary: {
        totalAmount,
        completedAmount,
        pendingAmount,
        failedAmount,
        successRate: payments.length > 0 ? (completedPayments.length / payments.length) * 100 : 0,
      },
      byStatus: {
        completed: {
          count: completedPayments.length,
          amount: completedAmount,
          percentage: totalAmount > 0 ? (completedAmount / totalAmount) * 100 : 0,
        },
        pending: {
          count: pendingPayments.length,
          amount: pendingAmount,
          percentage: totalAmount > 0 ? (pendingAmount / totalAmount) * 100 : 0,
        },
        failed: {
          count: failedPayments.length,
          amount: failedAmount,
          percentage: totalAmount > 0 ? (failedAmount / totalAmount) * 100 : 0,
        },
      },
      byMonth: this.groupPaymentsByMonth(payments),
      byState: this.groupPaymentsByState(payments),
    };
  }

  /**
   * Generate demographic report
   */
  async generateDemographicReport(filters: ReportFilters): Promise<any> {
    const where = this.buildWhereClause(filters);

    const applications = await this.prisma.application.findMany({
      where,
      include: {
        student: true,
        scholarship: true,
      },
    });

    return {
      byState: this.groupByState(applications),
      byGender: this.groupByGender(applications),
      byCategory: this.groupByCategory(applications),
      byEducation: this.groupByEducation(applications),
      byAge: this.groupByAge(applications),
      byIncome: this.groupByIncome(applications),
    };
  }

  /**
   * Generate performance report
   */
  async generatePerformanceReport(filters: ReportFilters): Promise<any> {
    const where = this.buildWhereClause(filters);

    const applications = await this.prisma.application.findMany({
      where,
      include: {
        student: true,
        scholarship: true,
      },
    });

    const processingTimes = applications
      .filter(app => app.submittedAt && app.reviewedAt)
      .map(app => {
        const submitted = new Date(app.submittedAt);
        const reviewed = new Date(app.reviewedAt);
        return Math.ceil((reviewed.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24));
      });

    const averageProcessingTime = processingTimes.length > 0
      ? processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length
      : 0;

    const approvedCount = applications.filter(app => app.status === 'APPROVED').length;
    const rejectedCount = applications.filter(app => app.status === 'REJECTED').length;
    const totalReviewed = approvedCount + rejectedCount;

    return {
      processingTime: {
        average: averageProcessingTime,
        min: processingTimes.length > 0 ? Math.min(...processingTimes) : 0,
        max: processingTimes.length > 0 ? Math.max(...processingTimes) : 0,
        median: this.calculateMedian(processingTimes),
      },
      approvalRates: {
        overall: totalReviewed > 0 ? (approvedCount / totalReviewed) * 100 : 0,
        byState: this.calculateApprovalRatesByState(applications),
        byScholarship: this.calculateApprovalRatesByScholarship(applications),
      },
      trends: {
        applicationsOverTime: this.groupApplicationsByTime(applications),
        approvalsOverTime: this.groupApprovalsByTime(applications),
      },
    };
  }

  /**
   * Export report data
   */
  async exportReport(
    reportType: string,
    filters: ReportFilters,
    format: 'CSV' | 'EXCEL' | 'PDF' = 'CSV',
  ): Promise<Buffer> {
    let data: any;

    switch (reportType) {
      case 'applications':
        data = await this.generateApplicationReport(filters);
        break;
      case 'scholarships':
        data = await this.generateScholarshipReport(filters.scholarshipId);
        break;
      case 'financial':
        data = await this.generateFinancialReport(filters);
        break;
      case 'demographics':
        data = await this.generateDemographicReport(filters);
        break;
      case 'performance':
        data = await this.generatePerformanceReport(filters);
        break;
      default:
        throw new Error('Invalid report type');
    }

    // This would integrate with your export service
    return this.convertToFormat(data, format);
  }

  /**
   * Build where clause for filtering
   */
  private buildWhereClause(filters: ReportFilters): any {
    const where: any = {};

    if (filters.startDate || filters.endDate) {
      where.submittedAt = {};
      if (filters.startDate) where.submittedAt.gte = filters.startDate;
      if (filters.endDate) where.submittedAt.lte = filters.endDate;
    }

    if (filters.applicationStatus) {
      where.status = filters.applicationStatus;
    }

    if (filters.scholarshipId) {
      where.scholarshipId = filters.scholarshipId;
    }

    if (filters.state || filters.gender || filters.category) {
      where.student = {};
      if (filters.state) where.student.state = filters.state;
      if (filters.gender) where.student.gender = filters.gender;
      if (filters.category) where.student.category = filters.category;
    }

    return where;
  }

  /**
   * Calculate summary metrics
   */
  private calculateSummary(
    applications: any[],
    approvedApplications: any[],
    rejectedApplications: any[],
    pendingApplications: any[],
    payments: any[],
  ) {
    const totalAmount = applications.reduce((sum, app) => sum + app.scholarship.amount, 0);
    const disbursedAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const pendingAmount = totalAmount - disbursedAmount;

    return {
      totalApplications: applications.length,
      approvedApplications: approvedApplications.length,
      rejectedApplications: rejectedApplications.length,
      pendingApplications: pendingApplications.length,
      totalAmount,
      disbursedAmount,
      pendingAmount,
    };
  }

  /**
   * Calculate trends over time
   */
  private async calculateTrends(filters: ReportFilters) {
    // This would calculate trends based on the filters
    return {
      applicationsOverTime: [],
      approvalsOverTime: [],
      disbursementsOverTime: [],
    };
  }

  /**
   * Calculate demographic data
   */
  private calculateDemographics(applications: any[]) {
    return {
      byState: this.groupByState(applications),
      byGender: this.groupByGender(applications),
      byCategory: this.groupByCategory(applications),
      byEducation: this.groupByEducation(applications),
    };
  }

  /**
   * Calculate performance metrics
   */
  private calculatePerformance(
    applications: any[],
    approvedApplications: any[],
    rejectedApplications: any[],
  ) {
    const totalReviewed = approvedApplications.length + rejectedApplications.length;
    const approvalRate = totalReviewed > 0 ? (approvedApplications.length / totalReviewed) * 100 : 0;
    const rejectionRate = totalReviewed > 0 ? (rejectedApplications.length / totalReviewed) * 100 : 0;

    return {
      averageProcessingTime: 0, // This would be calculated based on actual data
      approvalRate,
      rejectionRate,
      topPerformingStates: [],
    };
  }

  /**
   * Group applications by state
   */
  private groupByState(applications: any[]) {
    const grouped = applications.reduce((acc, app) => {
      const state = app.student.state;
      if (!acc[state]) acc[state] = 0;
      acc[state]++;
      return acc;
    }, {});

    const total = applications.length;
    return Object.entries(grouped).map(([state, count]) => ({
      state,
      count: count as number,
      percentage: total > 0 ? ((count as number) / total) * 100 : 0,
    }));
  }

  /**
   * Group applications by gender
   */
  private groupByGender(applications: any[]) {
    const grouped = applications.reduce((acc, app) => {
      const gender = app.student.gender;
      if (!acc[gender]) acc[gender] = 0;
      acc[gender]++;
      return acc;
    }, {});

    const total = applications.length;
    return Object.entries(grouped).map(([gender, count]) => ({
      gender,
      count: count as number,
      percentage: total > 0 ? ((count as number) / total) * 100 : 0,
    }));
  }

  /**
   * Group applications by category
   */
  private groupByCategory(applications: any[]) {
    const grouped = applications.reduce((acc, app) => {
      const category = app.student.category;
      if (!acc[category]) acc[category] = 0;
      acc[category]++;
      return acc;
    }, {});

    const total = applications.length;
    return Object.entries(grouped).map(([category, count]) => ({
      category,
      count: count as number,
      percentage: total > 0 ? ((count as number) / total) * 100 : 0,
    }));
  }

  /**
   * Group applications by education
   */
  private groupByEducation(applications: any[]) {
    const grouped = applications.reduce((acc, app) => {
      const education = app.student.educationLevel;
      if (!acc[education]) acc[education] = 0;
      acc[education]++;
      return acc;
    }, {});

    const total = applications.length;
    return Object.entries(grouped).map(([education, count]) => ({
      education,
      count: count as number,
      percentage: total > 0 ? ((count as number) / total) * 100 : 0,
    }));
  }

  /**
   * Group applications by age
   */
  private groupByAge(applications: any[]) {
    const grouped = applications.reduce((acc, app) => {
      const age = this.calculateAge(app.student.dateOfBirth);
      const ageGroup = this.getAgeGroup(age);
      if (!acc[ageGroup]) acc[ageGroup] = 0;
      acc[ageGroup]++;
      return acc;
    }, {});

    const total = applications.length;
    return Object.entries(grouped).map(([ageGroup, count]) => ({
      ageGroup,
      count: count as number,
      percentage: total > 0 ? ((count as number) / total) * 100 : 0,
    }));
  }

  /**
   * Group applications by income
   */
  private groupByIncome(applications: any[]) {
    const grouped = applications.reduce((acc, app) => {
      const income = app.student.familyIncome;
      const incomeGroup = this.getIncomeGroup(income);
      if (!acc[incomeGroup]) acc[incomeGroup] = 0;
      acc[incomeGroup]++;
      return acc;
    }, {});

    const total = applications.length;
    return Object.entries(grouped).map(([incomeGroup, count]) => ({
      incomeGroup,
      count: count as number,
      percentage: total > 0 ? ((count as number) / total) * 100 : 0,
    }));
  }

  /**
   * Group payments by month
   */
  private groupPaymentsByMonth(payments: any[]) {
    const grouped = payments.reduce((acc, payment) => {
      const month = new Date(payment.paymentDate).toISOString().slice(0, 7);
      if (!acc[month]) acc[month] = { count: 0, amount: 0 };
      acc[month].count++;
      acc[month].amount += payment.amount;
      return acc;
    }, {});

    return Object.entries(grouped).map(([month, data]) => ({
      month,
      count: (data as any).count,
      amount: (data as any).amount,
    }));
  }

  /**
   * Group payments by state
   */
  private groupPaymentsByState(payments: any[]) {
    const grouped = payments.reduce((acc, payment) => {
      const state = payment.application.student.state;
      if (!acc[state]) acc[state] = { count: 0, amount: 0 };
      acc[state].count++;
      acc[state].amount += payment.amount;
      return acc;
    }, {});

    return Object.entries(grouped).map(([state, data]) => ({
      state,
      count: (data as any).count,
      amount: (data as any).amount,
    }));
  }

  /**
   * Calculate approval rates by state
   */
  private calculateApprovalRatesByState(applications: any[]) {
    const stateStats = applications.reduce((acc, app) => {
      const state = app.student.state;
      if (!acc[state]) acc[state] = { total: 0, approved: 0 };
      acc[state].total++;
      if (app.status === 'APPROVED') acc[state].approved++;
      return acc;
    }, {});

    return Object.entries(stateStats).map(([state, stats]) => ({
      state,
      total: (stats as any).total,
      approved: (stats as any).approved,
      rate: (stats as any).total > 0 ? ((stats as any).approved / (stats as any).total) * 100 : 0,
    }));
  }

  /**
   * Calculate approval rates by scholarship
   */
  private calculateApprovalRatesByScholarship(applications: any[]) {
    const scholarshipStats = applications.reduce((acc, app) => {
      const scholarshipId = app.scholarshipId;
      if (!acc[scholarshipId]) acc[scholarshipId] = { total: 0, approved: 0, title: app.scholarship.title };
      acc[scholarshipId].total++;
      if (app.status === 'APPROVED') acc[scholarshipId].approved++;
      return acc;
    }, {});

    return Object.entries(scholarshipStats).map(([scholarshipId, stats]) => ({
      scholarshipId,
      title: (stats as any).title,
      total: (stats as any).total,
      approved: (stats as any).approved,
      rate: (stats as any).total > 0 ? ((stats as any).approved / (stats as any).total) * 100 : 0,
    }));
  }

  /**
   * Group applications by time
   */
  private groupApplicationsByTime(applications: any[]) {
    const grouped = applications.reduce((acc, app) => {
      const date = new Date(app.submittedAt).toISOString().slice(0, 7);
      if (!acc[date]) acc[date] = 0;
      acc[date]++;
      return acc;
    }, {});

    return Object.entries(grouped).map(([date, count]) => ({
      date,
      count: count as number,
    }));
  }

  /**
   * Group approvals by time
   */
  private groupApprovalsByTime(applications: any[]) {
    const approvedApplications = applications.filter(app => app.status === 'APPROVED');
    const grouped = approvedApplications.reduce((acc, app) => {
      const date = new Date(app.reviewedAt).toISOString().slice(0, 7);
      if (!acc[date]) acc[date] = 0;
      acc[date]++;
      return acc;
    }, {});

    return Object.entries(grouped).map(([date, count]) => ({
      date,
      count: count as number,
    }));
  }

  /**
   * Calculate age from date of birth
   */
  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Get age group
   */
  private getAgeGroup(age: number): string {
    if (age < 18) return 'Under 18';
    if (age < 25) return '18-24';
    if (age < 35) return '25-34';
    if (age < 45) return '35-44';
    if (age < 55) return '45-54';
    return '55+';
  }

  /**
   * Get income group
   */
  private getIncomeGroup(income: number): string {
    if (income < 100000) return 'Under 1 Lakh';
    if (income < 250000) return '1-2.5 Lakhs';
    if (income < 500000) return '2.5-5 Lakhs';
    if (income < 1000000) return '5-10 Lakhs';
    return '10+ Lakhs';
  }

  /**
   * Calculate median
   */
  private calculateMedian(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    
    const sorted = numbers.sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    
    return sorted[middle];
  }

  /**
   * Convert data to specified format
   */
  private convertToFormat(data: any, format: string): Buffer {
    // This would integrate with your export service (e.g., ExcelJS, PDFKit)
    switch (format) {
      case 'CSV':
        return this.convertToCSV(data);
      case 'EXCEL':
        return this.convertToExcel(data);
      case 'PDF':
        return this.convertToPDF(data);
      default:
        throw new Error('Unsupported format');
    }
  }

  /**
   * Convert data to CSV
   */
  private convertToCSV(data: any): Buffer {
    // This would convert data to CSV format
    return Buffer.from('CSV data would be here');
  }

  /**
   * Convert data to Excel
   */
  private convertToExcel(data: any): Buffer {
    // This would convert data to Excel format
    return Buffer.from('Excel data would be here');
  }

  /**
   * Convert data to PDF
   */
  private convertToPDF(data: any): Buffer {
    // This would convert data to PDF format
    return Buffer.from('PDF data would be here');
  }
}
