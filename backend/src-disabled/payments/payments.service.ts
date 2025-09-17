import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { DisbursePaymentDto } from './dto/disburse-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const { applicationId, amount, paymentMethod, remarks } = createPaymentDto;

    // Get application details
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        student: true,
        scholarship: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.status !== 'APPROVED') {
      throw new BadRequestException('Application must be approved before creating payment');
    }

    // Create payment record
    const payment = await this.prisma.payment.create({
      data: {
        applicationId,
        amount,
        paymentMethod,
        remarks,
        status: 'PENDING',
      },
    });

    return payment;
  }

  async findAll(filters: {
    page: number;
    limit: number;
    status?: string;
    studentId?: string;
    applicationId?: string;
  }) {
    const { page, limit, status, studentId, applicationId } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (applicationId) where.applicationId = applicationId;
    if (studentId) {
      where.application = {
        studentId: studentId,
      };
    }

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          application: {
            include: {
              student: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
              scholarship: {
                select: {
                  title: true,
                  amount: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return {
      payments: payments.map(payment => ({
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
        transactionId: payment.transactionId,
        bankReference: payment.bankReference,
        upiReference: payment.upiReference,
        paymentDate: payment.paymentDate,
        remarks: payment.remarks,
        student: payment.application.student,
        scholarship: payment.application.scholarship,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        application: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                address: true,
                city: true,
                state: true,
              },
            },
            scholarship: {
              select: {
                title: true,
                amount: true,
                category: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      return null;
    }

    return {
      ...payment,
      student: payment.application.student,
      scholarship: payment.application.scholarship,
    };
  }

  async disbursePayment(disbursePaymentDto: DisbursePaymentDto) {
    const { paymentId, bankDetails } = disbursePaymentDto;

    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        application: {
          include: {
            student: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== 'PENDING') {
      throw new BadRequestException('Payment is not in pending status');
    }

    // Update payment with bank details
    const updatedPayment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        bankName: bankDetails.bankName,
        accountNumber: bankDetails.accountNumber,
        ifscCode: bankDetails.ifscCode,
        accountHolderName: bankDetails.accountHolderName,
        status: 'PROCESSING',
      },
    });

    // Process payment through mock bank API
    const bankResponse = await this.processBankPayment(updatedPayment);

    // Update payment status based on bank response
    const finalPayment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: bankResponse.success ? 'COMPLETED' : 'FAILED',
        transactionId: bankResponse.transactionId,
        bankReference: bankResponse.bankReference,
        upiReference: bankResponse.upiReference,
        paymentDate: bankResponse.success ? new Date() : null,
        failureReason: bankResponse.success ? null : bankResponse.errorMessage,
        processedAt: new Date(),
        processedBy: 'current-user-id', // In real app, get from JWT
      },
    });

    return finalPayment;
  }

  async bulkDisbursePayments(paymentIds: string[]) {
    const results = [];
    const errors = [];

    for (const paymentId of paymentIds) {
      try {
        const payment = await this.prisma.payment.findUnique({
          where: { id: paymentId },
          include: {
            application: {
              include: {
                student: true,
              },
            },
          },
        });

        if (!payment) {
          errors.push({ paymentId, error: 'Payment not found' });
          continue;
        }

        if (payment.status !== 'PENDING') {
          errors.push({ paymentId, error: 'Payment is not in pending status' });
          continue;
        }

        // Get bank details from student's financial info
        const bankDetails = {
          bankName: payment.application.student.financialInfo?.bankName || 'Unknown Bank',
          accountNumber: payment.application.student.financialInfo?.accountNumber || '',
          ifscCode: payment.application.student.financialInfo?.ifscCode || '',
          accountHolderName: payment.application.student.financialInfo?.accountHolderName || 
            `${payment.application.student.firstName} ${payment.application.student.lastName}`,
        };

        const disbursedPayment = await this.disbursePayment({
          paymentId,
          bankDetails,
        });

        results.push(disbursedPayment);
      } catch (error) {
        errors.push({ paymentId, error: error.message });
      }
    }

    return {
      successful: results,
      failed: errors,
      summary: {
        total: paymentIds.length,
        successful: results.length,
        failed: errors.length,
      },
    };
  }

  async updateStatus(id: string, status: string, remarks?: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      return null;
    }

    const updatedPayment = await this.prisma.payment.update({
      where: { id },
      data: {
        status: status as any,
        remarks: remarks || payment.remarks,
        updatedAt: new Date(),
      },
    });

    return updatedPayment;
  }

  async getStats() {
    const [
      total,
      pending,
      processing,
      completed,
      failed,
      totalAmount,
      disbursedAmount,
    ] = await Promise.all([
      this.prisma.payment.count(),
      this.prisma.payment.count({ where: { status: 'PENDING' } }),
      this.prisma.payment.count({ where: { status: 'PROCESSING' } }),
      this.prisma.payment.count({ where: { status: 'COMPLETED' } }),
      this.prisma.payment.count({ where: { status: 'FAILED' } }),
      this.prisma.payment.aggregate({
        _sum: { amount: true },
      }),
      this.prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
    ]);

    const totalAmountValue = totalAmount._sum.amount || 0;
    const disbursedAmountValue = disbursedAmount._sum.amount || 0;

    return {
      total,
      pending,
      processing,
      completed,
      failed,
      totalAmount: totalAmountValue,
      disbursedAmount: disbursedAmountValue,
      averageAmount: total > 0 ? totalAmountValue / total : 0,
      successRate: total > 0 ? (completed / total) * 100 : 0,
    };
  }

  async exportToCSV(startDate?: string, endDate?: string) {
    const where: any = {};
    
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const payments = await this.prisma.payment.findMany({
      where,
      include: {
        application: {
          include: {
            student: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
            scholarship: {
              select: {
                title: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Generate CSV data
    const csvHeaders = [
      'Payment ID',
      'Student Name',
      'Email',
      'Phone',
      'Scholarship',
      'Amount',
      'Status',
      'Payment Method',
      'Transaction ID',
      'Bank Reference',
      'Payment Date',
      'Created At',
    ];

    const csvRows = payments.map(payment => [
      payment.id,
      `${payment.application.student.firstName} ${payment.application.student.lastName}`,
      payment.application.student.email,
      payment.application.student.phone,
      payment.application.scholarship.title,
      payment.amount,
      payment.status,
      payment.paymentMethod || '',
      payment.transactionId || '',
      payment.bankReference || '',
      payment.paymentDate ? payment.paymentDate.toISOString() : '',
      payment.createdAt.toISOString(),
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return {
      filename: `payments_${new Date().toISOString().split('T')[0]}.csv`,
      content: csvContent,
      mimeType: 'text/csv',
    };
  }

  private async processBankPayment(payment: any) {
    // Mock bank API integration
    // In production, this would integrate with actual bank APIs like UPI, NEFT, RTGS
    
    const mockBankResponse = {
      success: Math.random() > 0.1, // 90% success rate for demo
      transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
      bankReference: `BANK${Date.now()}`,
      upiReference: payment.paymentMethod === 'UPI' ? `UPI${Date.now()}` : null,
      errorMessage: null,
    };

    if (!mockBankResponse.success) {
      mockBankResponse.errorMessage = 'Bank processing failed - insufficient funds';
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return mockBankResponse;
  }
}
