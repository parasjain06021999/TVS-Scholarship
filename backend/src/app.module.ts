import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { StudentsModule } from './students/students.module';
import { ScholarshipsModule } from './scholarships/scholarships.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MailModule } from './mail/mail.module';
import { HealthModule } from './health/health.module';
import { ApplicationsModule } from './applications/applications.module';
import { DocumentsModule } from './documents/documents.module';
import { PaymentsModule } from './payments/payments.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { CommunicationsModule } from './communications/communications.module';
import { ReportsModule } from './reports/reports.module';
import { SecurityModule } from './security/security.module';
import { ComplianceModule } from './compliance/compliance.module';
import { UploadModule } from './upload/upload.module';
import { FeedbackModule } from './feedback/feedback.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Database
    PrismaModule,

    // Core feature modules
    AuthModule,
    StudentsModule,
    ScholarshipsModule,
    ApplicationsModule,
    DocumentsModule,
    PaymentsModule,
    AnalyticsModule,
    NotificationsModule,
    CommunicationsModule,
    ReportsModule,
    SecurityModule,
    ComplianceModule,
    UploadModule,
    FeedbackModule,
    MailModule,
    HealthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}