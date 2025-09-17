"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PaymentsService = class PaymentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPayment(paymentData, userId) {
        try {
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
        }
        catch (error) {
            throw new Error(`Failed to create payment: ${error.message}`);
        }
    }
    async disbursePayment(paymentData, userId) {
        try {
            const payment = await this.prisma.payment.create({
                data: {
                    applicationId: paymentData.applicationId,
                    amount: paymentData.amount,
                    status: 'PENDING',
                    bankName: paymentData.bankName,
                    accountNumber: paymentData.accountNumber,
                    ifscCode: paymentData.ifscCode,
                    accountHolderName: paymentData.accountHolderName,
                },
            });
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
        }
        catch (error) {
            throw new Error(`Failed to disburse payment: ${error.message}`);
        }
    }
    async getPayments(query, user) {
        try {
            const where = {};
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
        }
        catch (error) {
            throw new Error(`Failed to fetch payments: ${error.message}`);
        }
    }
    async getPayment(id, user) {
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
                throw new common_1.NotFoundException('Payment not found');
            }
            if (user.role === 'STUDENT' && payment.application.student.userId !== user.id) {
                throw new common_1.ForbiddenException('Access denied');
            }
            return {
                success: true,
                data: payment,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new Error(`Failed to fetch payment: ${error.message}`);
        }
    }
    async updatePaymentStatus(id, status, notes, userId) {
        try {
            const payment = await this.prisma.payment.update({
                where: { id },
                data: {
                    status: status,
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
        }
        catch (error) {
            throw new Error(`Failed to update payment status: ${error.message}`);
        }
    }
    async exportPaymentsCSV(query, user) {
        try {
            const payments = await this.getPayments(query, user);
            const csvHeader = 'ID,Student Name,Amount,Status,Disbursed Date,Bank Name,Account Number\n';
            const csvRows = payments.data.map(payment => `${payment.id},${payment.application.student.firstName} ${payment.application.student.lastName},${payment.amount},${payment.status},${payment.createdAt || ''},${payment.bankName || ''},${payment.accountNumber || ''}`).join('\n');
            const csvContent = csvHeader + csvRows;
            return {
                success: true,
                data: {
                    content: csvContent,
                    filename: `payments_${new Date().toISOString().split('T')[0]}.csv`,
                },
            };
        }
        catch (error) {
            throw new Error(`Failed to export payments: ${error.message}`);
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map