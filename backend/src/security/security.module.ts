import { Module } from '@nestjs/common';
import { SecurityController } from './security.controller';
import { AccessControlService } from './access-control.service';
import { AuditLoggerService } from './audit-logger.service';
import { EncryptionService } from './encryption.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SecurityController],
  providers: [AccessControlService, AuditLoggerService, EncryptionService],
  exports: [AccessControlService, AuditLoggerService, EncryptionService],
})
export class SecurityModule {}
