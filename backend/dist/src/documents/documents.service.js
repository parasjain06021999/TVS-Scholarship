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
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DocumentsService = class DocumentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async uploadDocument(file, body, userId) {
        try {
            const document = await this.prisma.document.create({
                data: {
                    fileName: file.originalname,
                    filePath: file.path,
                    fileSize: file.size,
                    mimeType: file.mimetype,
                    type: body.type || 'OTHER',
                    studentId: userId,
                    applicationId: body.applicationId || null,
                },
            });
            return {
                success: true,
                message: 'Document uploaded successfully',
                data: document,
            };
        }
        catch (error) {
            throw new Error(`Failed to upload document: ${error.message}`);
        }
    }
    async getUserDocuments(userId) {
        try {
            const documents = await this.prisma.document.findMany({
                where: {
                    studentId: userId,
                },
                orderBy: {
                    uploadedAt: 'desc',
                },
            });
            return {
                success: true,
                data: documents,
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch documents: ${error.message}`);
        }
    }
    async getDocument(id, userId) {
        try {
            const document = await this.prisma.document.findUnique({
                where: { id },
            });
            if (!document) {
                throw new common_1.NotFoundException('Document not found');
            }
            if (document.studentId !== userId) {
                throw new common_1.ForbiddenException('Access denied');
            }
            return {
                success: true,
                data: document,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new Error(`Failed to fetch document: ${error.message}`);
        }
    }
    async verifyDocument(id, status, notes, userId) {
        try {
            const document = await this.prisma.document.update({
                where: { id },
                data: {},
            });
            return {
                success: true,
                message: 'Document verification updated',
                data: document,
            };
        }
        catch (error) {
            throw new Error(`Failed to verify document: ${error.message}`);
        }
    }
    async deleteDocument(id, userId) {
        try {
            const document = await this.prisma.document.findUnique({
                where: { id },
            });
            if (!document) {
                throw new common_1.NotFoundException('Document not found');
            }
            if (document.studentId !== userId) {
                throw new common_1.ForbiddenException('Access denied');
            }
            await this.prisma.document.delete({
                where: { id },
            });
            return {
                success: true,
                message: 'Document deleted successfully',
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new Error(`Failed to delete document: ${error.message}`);
        }
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map