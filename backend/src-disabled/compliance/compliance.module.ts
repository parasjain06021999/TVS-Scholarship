import { Module } from '@nestjs/common';
import { GdprModule } from './gdpr.module';
import { SecurityModule } from '../security/security.module';
import { ComplianceController } from './compliance.controller';

@Module({
  imports: [
    GdprModule,
    SecurityModule,
  ],
  controllers: [ComplianceController],
  exports: [
    GdprModule,
    SecurityModule,
  ],
})
export class ComplianceModule {}