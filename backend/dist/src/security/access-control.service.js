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
exports.AccessControlService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AccessControlService = class AccessControlService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserPermissions(userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    role: true,
                    isActive: true,
                },
            });
            if (!user) {
                throw new Error('User not found');
            }
            const permissions = this.getRolePermissions(user.role);
            return {
                success: true,
                data: {
                    userId: user.id,
                    role: user.role,
                    isActive: user.isActive,
                    permissions,
                },
            };
        }
        catch (error) {
            throw new Error(`Failed to get user permissions: ${error.message}`);
        }
    }
    getRolePermissions(role) {
        const rolePermissions = {
            ADMIN: [
                'READ_ALL_APPLICATIONS',
                'WRITE_ALL_APPLICATIONS',
                'READ_ALL_STUDENTS',
                'WRITE_ALL_STUDENTS',
                'READ_ALL_SCHOLARSHIPS',
                'WRITE_ALL_SCHOLARSHIPS',
                'READ_ALL_PAYMENTS',
                'WRITE_ALL_PAYMENTS',
                'READ_ALL_DOCUMENTS',
                'WRITE_ALL_DOCUMENTS',
                'READ_ALL_REPORTS',
                'WRITE_ALL_REPORTS',
                'READ_ALL_COMMUNICATIONS',
                'WRITE_ALL_COMMUNICATIONS',
                'READ_ALL_AUDIT_LOGS',
                'MANAGE_USERS',
                'MANAGE_SYSTEM',
            ],
            REVIEWER: [
                'READ_ALL_APPLICATIONS',
                'WRITE_APPLICATION_STATUS',
                'READ_ALL_STUDENTS',
                'READ_ALL_SCHOLARSHIPS',
                'READ_ALL_DOCUMENTS',
                'READ_ALL_REPORTS',
                'READ_ALL_COMMUNICATIONS',
                'WRITE_COMMUNICATIONS',
            ],
            STUDENT: [
                'READ_OWN_APPLICATIONS',
                'WRITE_OWN_APPLICATIONS',
                'READ_OWN_PROFILE',
                'WRITE_OWN_PROFILE',
                'READ_OWN_DOCUMENTS',
                'WRITE_OWN_DOCUMENTS',
                'READ_OWN_PAYMENTS',
                'READ_OWN_NOTIFICATIONS',
            ],
        };
        return rolePermissions[role] || [];
    }
    async checkPermission(userId, permission) {
        try {
            const userPermissions = await this.getUserPermissions(userId);
            return userPermissions.data.permissions.includes(permission);
        }
        catch (error) {
            return false;
        }
    }
    async canAccessResource(userId, resourceType, resourceId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { role: true },
            });
            if (!user)
                return false;
            if (user.role === 'ADMIN')
                return true;
            if (user.role === 'REVIEWER') {
                return ['applications', 'students', 'scholarships', 'documents', 'reports'].includes(resourceType);
            }
            if (user.role === 'STUDENT') {
                if (!resourceId)
                    return false;
                switch (resourceType) {
                    case 'applications':
                        const application = await this.prisma.application.findUnique({
                            where: { id: resourceId },
                            select: { student: { select: { userId: true } } },
                        });
                        return application?.student.userId === userId;
                    case 'students':
                        return resourceId === userId;
                    case 'documents':
                        const document = await this.prisma.document.findUnique({
                            where: { id: resourceId },
                            select: { studentId: true },
                        });
                        return document?.studentId === userId;
                    default:
                        return false;
                }
            }
            return false;
        }
        catch (error) {
            return false;
        }
    }
};
exports.AccessControlService = AccessControlService;
exports.AccessControlService = AccessControlService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AccessControlService);
//# sourceMappingURL=access-control.service.js.map