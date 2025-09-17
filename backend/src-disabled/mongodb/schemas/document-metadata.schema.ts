import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DocumentMetadataDocument = DocumentMetadata & Document;

@Schema({ timestamps: true })
export class DocumentMetadata {
  @Prop({ required: true })
  documentId: string;

  @Prop({ required: true })
  studentId: string;

  @Prop({ required: false })
  applicationId?: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  filePath: string;

  @Prop({ required: true })
  fileSize: number;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  fileHash: string;

  @Prop({ required: true, default: 'uploaded' })
  status: string; // uploaded, verified, rejected, pending_verification

  @Prop({ required: false })
  verifiedBy?: string;

  @Prop({ required: false })
  verifiedAt?: Date;

  @Prop({ required: false })
  verificationNotes?: string;

  @Prop({ required: false })
  rejectionReason?: string;

  @Prop({ required: false })
  virusScanResult?: string;

  @Prop({ required: false })
  virusScanDate?: Date;

  @Prop({ required: false })
  thumbnailPath?: string;

  @Prop({ required: false })
  extractedText?: string;

  @Prop({ required: false })
  metadata?: Record<string, any>;

  @Prop({ required: true })
  uploadedBy: string;

  @Prop({ required: true })
  uploadedAt: Date;

  @Prop({ required: false })
  expiresAt?: Date;

  @Prop({ required: false })
  accessCount: number;

  @Prop({ required: false })
  lastAccessedAt?: Date;

  @Prop({ required: false })
  tags?: string[];

  @Prop({ required: false })
  description?: string;

  @Prop({ required: false })
  isPublic: boolean;

  @Prop({ required: false })
  downloadCount: number;

  @Prop({ required: false })
  version: number;

  @Prop({ required: false })
  parentDocumentId?: string;

  @Prop({ required: false })
  isArchived: boolean;

  @Prop({ required: false })
  archivedAt?: Date;

  @Prop({ required: false })
  archivedBy?: string;
}

export const DocumentMetadataSchema = SchemaFactory.createForClass(DocumentMetadata);

// Indexes for better performance
DocumentMetadataSchema.index({ documentId: 1 });
DocumentMetadataSchema.index({ studentId: 1 });
DocumentMetadataSchema.index({ applicationId: 1 });
DocumentMetadataSchema.index({ type: 1 });
DocumentMetadataSchema.index({ status: 1 });
DocumentMetadataSchema.index({ uploadedAt: -1 });
DocumentMetadataSchema.index({ fileHash: 1 });
DocumentMetadataSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });