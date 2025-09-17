import { Module } from '@nestjs/common';
import { AccessControlService } from './access-control.service';
import { EncryptionService } from './encryption.service';
import { AuditLoggerService } from './audit-logger.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    AccessControlService,
    EncryptionService,
    AuditLoggerService,
  ],
  exports: [
    AccessControlService,
    EncryptionService,
    AuditLoggerService,
  ],
})
export class SecurityModule {}
