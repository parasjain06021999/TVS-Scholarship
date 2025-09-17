import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(query: any, user: any) {
    try {
      const [
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        totalScholarships,
        totalStudents,
        totalPayments,
        totalAmountDisbursed,
      ] = await Promise.all([
        this.prisma.application.count(),
        this.prisma.application.count({ where: { status: 'PENDING' } }),
        this.prisma.application.count({ where: { status: 'APPROVED' } }),
        this.prisma.application.count({ where: { status: 'REJECTED' } }),
        this.prisma.scholarship.count(),
        this.prisma.student.count(),
        this.prisma.payment.count(),
        this.prisma.payment.aggregate({
          _sum: { amount: true },
          where: { status: 'COMPLETED' },
        }),
      ]);

      return {
        success: true,
        data: {
          totalApplications,
          pendingApplications,
          approvedApplications,
          rejectedApplications,
          totalScholarships,
          totalStudents,
          totalPayments,
          totalAmountDisbursed: totalAmountDisbursed._sum.amount || 0,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch dashboard stats: ${error.message}`);
    }
  }

  async getApplicationAnalytics(query: any, user: any) {
    try {
      const { startDate, endDate, status, category } = query;

      const where: any = {};
      if (startDate) where.createdAt = { gte: new Date(startDate) };
      if (endDate) where.createdAt = { lte: new Date(endDate) };
      if (status) where.status = status;

      const applications = await this.prisma.application.findMany({
        where,
        include: {
          scholarship: true,
          student: true,
        },
      });

      // Group by status
      const statusCounts = applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {});

      // Group by month
      const monthlyData = applications.reduce((acc, app) => {
        const month = app.createdAt.toISOString().substring(0, 7);
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      return {
        success: true,
        data: {
          total: applications.length,
          statusCounts,
          monthlyData,
          applications: applications.slice(0, 10), // Last 10 applications
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch application analytics: ${error.message}`);
    }
  }

  async getScholarshipAnalytics(query: any, user: any) {
    try {
      const scholarships = await this.prisma.scholarship.findMany({
        include: {
          applications: true,
        },
      });

      const analytics = scholarships.map(scholarship => ({
        id: scholarship.id,
        title: scholarship.title,
        totalApplications: scholarship.applications.length,
        approvedApplications: scholarship.applications.filter(app => app.status === 'APPROVED').length,
        pendingApplications: scholarship.applications.filter(app => app.status === 'PENDING').length,
        rejectedApplications: scholarship.applications.filter(app => app.status === 'REJECTED').length,
        totalAmount: scholarship.maxAmount,
        disbursedAmount: scholarship.applications
          .filter(app => app.status === 'APPROVED')
          .reduce((sum, app) => sum + (scholarship.amount || 0), 0),
      }));

      return {
        success: true,
        data: analytics,
      };
    } catch (error) {
      throw new Error(`Failed to fetch scholarship analytics: ${error.message}`);
    }
  }

  async getPaymentAnalytics(query: any, user: any) {
    try {
      const { startDate, endDate, status } = query;

      const where: any = {};
      if (startDate) where.createdAt = { gte: new Date(startDate) };
      if (endDate) where.createdAt = { lte: new Date(endDate) };
      if (status) where.status = status;

      const payments = await this.prisma.payment.findMany({
        where,
        include: {
          application: {
            include: {
              student: true,
              scholarship: true,
            },
          },
        },
      });

      const statusCounts = payments.reduce((acc, payment) => {
        acc[payment.status] = (acc[payment.status] || 0) + 1;
        return acc;
      }, {});

      const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

      return {
        success: true,
        data: {
          total: payments.length,
          statusCounts,
          totalAmount,
          payments: payments.slice(0, 10), // Last 10 payments
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch payment analytics: ${error.message}`);
    }
  }

  async getStudentAnalytics(query: any, user: any) {
    try {
      const students = await this.prisma.student.findMany({
        include: {
          applications: {
            include: {
              scholarship: true,
            },
          },
        },
      });

      const analytics = {
        totalStudents: students.length,
        studentsWithApplications: students.filter(s => s.applications.length > 0).length,
        studentsByGender: students.reduce((acc, student) => {
          acc[student.gender] = (acc[student.gender] || 0) + 1;
          return acc;
        }, {}),
        studentsByState: students.reduce((acc, student) => {
          const state = (student.address as any)?.state || 'Unknown';
          acc[state] = (acc[state] || 0) + 1;
          return acc;
        }, {}),
        topPerformingStudents: students
          .filter(s => s.applications.length > 0)
          .sort((a, b) => b.applications.length - a.applications.length)
          .slice(0, 10)
          .map(student => ({
            id: student.id,
            name: `${student.firstName} ${student.lastName}`,
            applicationsCount: student.applications.length,
            approvedCount: student.applications.filter(app => app.status === 'APPROVED').length,
          })),
      };

      return {
        success: true,
        data: analytics,
      };
    } catch (error) {
      throw new Error(`Failed to fetch student analytics: ${error.message}`);
    }
  }

  async exportReport(query: any, user: any) {
    try {
      const { type, format = 'csv' } = query;

      let data: any[] = [];

      switch (type) {
        case 'applications':
          data = await this.prisma.application.findMany({
            include: {
              student: true,
              scholarship: true,
            },
          });
          break;
        case 'payments':
          data = await this.prisma.payment.findMany({
            include: {
              application: {
                include: {
                  student: true,
                  scholarship: true,
                },
              },
            },
          });
          break;
        case 'students':
          data = await this.prisma.student.findMany();
          break;
        default:
          throw new Error('Invalid report type');
      }

      if (format === 'csv') {
        const csvContent = this.convertToCSV(data);
        return {
          success: true,
          data: {
            content: csvContent,
            filename: `${type}_report_${new Date().toISOString().split('T')[0]}.csv`,
          },
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new Error(`Failed to export report: ${error.message}`);
    }
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value).replace(/,/g, ';');
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }
}
