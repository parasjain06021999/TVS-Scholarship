import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: false })
  subType?: string;

  @Prop({ required: false })
  priority?: string; // low, medium, high, urgent

  @Prop({ required: true, default: false })
  isRead: boolean;

  @Prop({ required: false })
  readAt?: Date;

  @Prop({ required: false })
  data?: Record<string, any>;

  @Prop({ required: false })
  actionUrl?: string;

  @Prop({ required: false })
  actionText?: string;

  @Prop({ required: false })
  imageUrl?: string;

  @Prop({ required: false })
  icon?: string;

  @Prop({ required: false })
  color?: string;

  @Prop({ required: false })
  badge?: string;

  @Prop({ required: false })
  sound?: string;

  @Prop({ required: false })
  vibration?: boolean;

  @Prop({ required: false })
  silent?: boolean;

  @Prop({ required: false })
  scheduledAt?: Date;

  @Prop({ required: false })
  sentAt?: Date;

  @Prop({ required: false })
  deliveredAt?: Date;

  @Prop({ required: false })
  clickedAt?: Date;

  @Prop({ required: false })
  dismissedAt?: Date;

  @Prop({ required: false })
  expiresAt?: Date;

  @Prop({ required: false })
  retryCount: number;

  @Prop({ required: false })
  lastRetryAt?: Date;

  @Prop({ required: false })
  errorMessage?: string;

  @Prop({ required: false })
  channel?: string; // email, sms, push, in_app

  @Prop({ required: false })
  templateId?: string;

  @Prop({ required: false })
  campaignId?: string;

  @Prop({ required: false })
  tags?: string[];

  @Prop({ required: false })
  metadata?: Record<string, any>;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Indexes for better performance
NotificationSchema.index({ userId: 1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ isRead: 1 });
NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ scheduledAt: 1 });
NotificationSchema.index({ expiresAt: 1 });
NotificationSchema.index({ channel: 1 });
NotificationSchema.index({ campaignId: 1 });
