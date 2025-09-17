import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  entity: string;

  @Prop({ required: false })
  entityId?: string;

  @Prop({ required: false })
  oldValues?: Record<string, any>;

  @Prop({ required: false })
  newValues?: Record<string, any>;

  @Prop({ required: false })
  ipAddress?: string;

  @Prop({ required: false })
  userAgent?: string;

  @Prop({ required: false })
  sessionId?: string;

  @Prop({ required: false })
  requestId?: string;

  @Prop({ required: false })
  duration?: number; // in milliseconds

  @Prop({ required: false })
  status: string; // success, error, warning

  @Prop({ required: false })
  errorMessage?: string;

  @Prop({ required: false })
  additionalData?: Record<string, any>;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: false })
  module?: string;

  @Prop({ required: false })
  subModule?: string;

  @Prop({ required: false })
  severity?: string; // low, medium, high, critical

  @Prop({ required: false })
  tags?: string[];
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

// Indexes for better performance
AuditLogSchema.index({ userId: 1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ entity: 1 });
AuditLogSchema.index({ entityId: 1 });
AuditLogSchema.index({ timestamp: -1 });
AuditLogSchema.index({ status: 1 });
AuditLogSchema.index({ module: 1 });
AuditLogSchema.index({ severity: 1 });
