import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async createPayment(paymentData: any, userId: string) {
    try {
      // Generate transaction ID
      const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      
      const payment = await this.prisma.payment.create({
        data: {
          applicationId: paymentData.applicationId,
          amount: paymentData.amount,
          status: paymentData.status || 'PENDING',
          paymentMethod: paymentData.paymentMethod || 'NEFT',
          transactionId: transactionId,
          processedBy: userId,
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

      return {
        success: true,
        message: 'Payment created successfully',
        data: payment,
      };
    } catch (error) {
      throw new Error(`Failed to create payment: ${error.message}`);
    }
  }

  async disbursePayment(paymentData: any, userId: string) {
    try {
      const payment = await this.prisma.payment.create({
        data: {
          applicationId: paymentData.applicationId,
          amount: paymentData.amount,
          status: 'PENDING',
          // disbursedBy: userId, // Field doesn't exist in schema
          bankName: paymentData.bankName,
          accountNumber: paymentData.accountNumber,
          ifscCode: paymentData.ifscCode,
          accountHolderName: paymentData.accountHolderName,
        },
      });

      // TODO: Integrate with actual bank API
      // For now, simulate processing
      setTimeout(async () => {
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'PROCESSING',
            processedAt: new Date(),
            processedBy: userId,
          },
        });
      }, 5000);

      return {
        success: true,
        message: 'Payment disbursal initiated',
        data: payment,
      };
    } catch (error) {
      throw new Error(`Failed to disburse payment: ${error.message}`);
    }
  }

  async getPayments(query: any, user: any) {
    try {
      const where: any = {};

      // Role-based filtering
      if (user.role === 'STUDENT') {
        where.student = {
          userId: user.id,
        };
      }

      if (query.status) {
        where.status = query.status;
      }

      if (query.applicationId) {
        where.applicationId = query.applicationId;
      }

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
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        success: true,
        data: payments,
      };
    } catch (error) {
      throw new Error(`Failed to fetch payments: ${error.message}`);
    }
  }

  async getPayment(id: string, user: any) {
    try {
      const payment = await this.prisma.payment.findUnique({
        where: { id },
        include: {
          application: {
            include: {
              student: true,
              scholarship: true,
            },
          },
        },
      });

      if (!payment) {
        throw new NotFoundException('Payment not found');
      }

      // Check access permissions
      if (user.role === 'STUDENT' && payment.application.student.userId !== user.id) {
        throw new ForbiddenException('Access denied');
      }

      return {
        success: true,
        data: payment,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new Error(`Failed to fetch payment: ${error.message}`);
    }
  }

  async updatePaymentStatus(id: string, status: string, notes: string, userId: string) {
    try {
      const payment = await this.prisma.payment.update({
        where: { id },
        data: {
          status: status as any,
          failureReason: notes,
          processedAt: new Date(),
          processedBy: userId,
        },
      });

      return {
        success: true,
        message: 'Payment status updated',
        data: payment,
      };
    } catch (error) {
      throw new Error(`Failed to update payment status: ${error.message}`);
    }
  }

  async exportPaymentsCSV(query: any, user: any) {
    try {
      const payments = await this.getPayments(query, user);
      
      // Generate CSV content
      const csvHeader = 'ID,Student Name,Amount,Status,Disbursed Date,Bank Name,Account Number\n';
      const csvRows = payments.data.map(payment => 
        `${payment.id},${payment.application.student.firstName} ${payment.application.student.lastName},${payment.amount},${payment.status},${payment.createdAt || ''},${payment.bankName || ''},${payment.accountNumber || ''}`
      ).join('\n');

      const csvContent = csvHeader + csvRows;

      return {
        success: true,
        data: {
          content: csvContent,
          filename: `payments_${new Date().toISOString().split('T')[0]}.csv`,
        },
      };
    } catch (error) {
      throw new Error(`Failed to export payments: ${error.message}`);
    }
  }
}
