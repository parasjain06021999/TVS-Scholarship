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
exports.DocumentMetadataSchema = exports.DocumentMetadata = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let DocumentMetadata = class DocumentMetadata {
};
exports.DocumentMetadata = DocumentMetadata;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DocumentMetadata.prototype, "documentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DocumentMetadata.prototype, "studentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], DocumentMetadata.prototype, "applicationId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DocumentMetadata.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DocumentMetadata.prototype, "fileName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DocumentMetadata.prototype, "originalName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DocumentMetadata.prototype, "filePath", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DocumentMetadata.prototype, "fileSize", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DocumentMetadata.prototype, "mimeType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DocumentMetadata.prototype, "fileHash", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'uploaded' }),
    __metadata("design:type", String)
], DocumentMetadata.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], DocumentMetadata.prototype, "verifiedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Date)
], DocumentMetadata.prototype, "verifiedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], DocumentMetadata.prototype, "verificationNotes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], DocumentMetadata.prototype, "rejectionReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], DocumentMetadata.prototype, "virusScanResult", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Date)
], DocumentMetadata.prototype, "virusScanDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], DocumentMetadata.prototype, "thumbnailPath", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], DocumentMetadata.prototype, "extractedText", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Object)
], DocumentMetadata.prototype, "metadata", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DocumentMetadata.prototype, "uploadedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], DocumentMetadata.prototype, "uploadedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Date)
], DocumentMetadata.prototype, "expiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], DocumentMetadata.prototype, "accessCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Date)
], DocumentMetadata.prototype, "lastAccessedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Array)
], DocumentMetadata.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], DocumentMetadata.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Boolean)
], DocumentMetadata.prototype, "isPublic", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], DocumentMetadata.prototype, "downloadCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], DocumentMetadata.prototype, "version", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], DocumentMetadata.prototype, "parentDocumentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Boolean)
], DocumentMetadata.prototype, "isArchived", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Date)
], DocumentMetadata.prototype, "archivedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], DocumentMetadata.prototype, "archivedBy", void 0);
exports.DocumentMetadata = DocumentMetadata = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], DocumentMetadata);
exports.DocumentMetadataSchema = mongoose_1.SchemaFactory.createForClass(DocumentMetadata);
exports.DocumentMetadataSchema.index({ documentId: 1 });
exports.DocumentMetadataSchema.index({ studentId: 1 });
exports.DocumentMetadataSchema.index({ applicationId: 1 });
exports.DocumentMetadataSchema.index({ type: 1 });
exports.DocumentMetadataSchema.index({ status: 1 });
exports.DocumentMetadataSchema.index({ uploadedAt: -1 });
exports.DocumentMetadataSchema.index({ fileHash: 1 });
exports.DocumentMetadataSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
//# sourceMappingURL=document-metadata.schema.js.map