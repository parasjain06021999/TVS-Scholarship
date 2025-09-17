import { Module } from '@nestjs/common';
import { ComplianceController } from './compliance.controller';
import { GdprService } from './gdpr.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ComplianceController],
  providers: [GdprService],
  exports: [GdprService],
})
export class ComplianceModule {}
