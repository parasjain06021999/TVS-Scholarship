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
exports.GdprService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GdprService = class GdprService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserConsent(userId, requestingUser) {
        try {
            if (requestingUser.role !== 'ADMIN' && requestingUser.id !== userId) {
                throw new common_1.ForbiddenException('Access denied');
            }
            const consent = await this.prisma.consentRecord.findFirst({
                where: { userId },
            });
            return {
                success: true,
                data: consent || {
                    userId,
                    status: 'PENDING',
                    consentGiven: false,
                    consentDate: null,
                    consentVersion: '1.0',
                },
            };
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new Error(`Failed to get user consent: ${error.message}`);
        }
    }
    async updateUserConsent(consentData, userId) {
        try {
            const consent = await this.prisma.consentRecord.create({
                data: {
                    userId,
                    status: consentData.status || 'ACTIVE',
                    consentVersion: consentData.consentVersion || '1.0',
                    purpose: consentData.purpose || 'General data processing',
                    dataTypes: consentData.dataTypes || ['personal', 'contact', 'academic'],
                },
            });
            return {
                success: true,
                message: 'Consent updated successfully',
                data: consent,
            };
        }
        catch (error) {
            throw new Error(`Failed to update user consent: ${error.message}`);
        }
    }
    async exportUserData(userId, requestingUser) {
        try {
            if (requestingUser.role !== 'ADMIN' && requestingUser.id !== userId) {
                throw new common_1.ForbiddenException('Access denied');
            }
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: {
                    student: true,
                },
            });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            const exportData = {
                personalInfo: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    isActive: user.isActive,
                    createdAt: user.createdAt,
                },
                studentProfile: user.student ? {
                    firstName: user.student.firstName,
                    lastName: user.student.lastName,
                    dateOfBirth: user.student.dateOfBirth,
                    gender: user.student.gender,
                    phone: user.student.phone,
                    address: user.student.address,
                } : null,
                exportedAt: new Date().toISOString(),
            };
            return {
                success: true,
                data: exportData,
            };
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to export user data: ${error.message}`);
        }
    }
    async deleteUserData(userId, requestingUser) {
        try {
            if (requestingUser.role !== 'ADMIN') {
                throw new common_1.ForbiddenException('Only administrators can delete user data');
            }
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            await this.prisma.consentRecord.deleteMany({ where: { userId } });
            await this.prisma.notification.deleteMany({ where: { userId } });
            await this.prisma.payment.deleteMany({ where: { application: { student: { userId } } } });
            await this.prisma.document.deleteMany({ where: { studentId: userId } });
            await this.prisma.application.deleteMany({ where: { student: { userId } } });
            await this.prisma.student.deleteMany({ where: { userId } });
            await this.prisma.user.delete({ where: { id: userId } });
            return {
                success: true,
                message: 'User data deleted successfully',
            };
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to delete user data: ${error.message}`);
        }
    }
    async getGdprAuditTrail(requestingUser) {
        try {
            if (requestingUser.role !== 'ADMIN') {
                throw new common_1.ForbiddenException('Access denied');
            }
            const auditTrail = await this.prisma.auditLog.findMany({
                where: {
                    OR: [
                        { action: { contains: 'CONSENT' } },
                        { action: { contains: 'DATA_EXPORT' } },
                        { action: { contains: 'DATA_DELETION' } },
                    ],
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return {
                success: true,
                data: auditTrail,
            };
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new Error(`Failed to get GDPR audit trail: ${error.message}`);
        }
    }
    async requestUserConsent(consentRequest, requestedBy) {
        try {
            const request = await this.prisma.consentRecord.create({
                data: {
                    userId: consentRequest.userId,
                    status: 'PENDING',
                    consentVersion: consentRequest.consentVersion || '1.0',
                    purpose: consentRequest.purpose || 'Data processing consent',
                    dataTypes: consentRequest.dataTypes || ['personal', 'contact'],
                },
            });
            return {
                success: true,
                message: 'Consent request created successfully',
                data: request,
            };
        }
        catch (error) {
            throw new Error(`Failed to request user consent: ${error.message}`);
        }
    }
};
exports.GdprService = GdprService;
exports.GdprService = GdprService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GdprService);
//# sourceMappingURL=gdpr.service.js.map