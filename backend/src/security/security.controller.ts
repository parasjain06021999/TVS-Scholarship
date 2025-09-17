import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AccessControlService } from './access-control.service';
import { AuditLoggerService } from './audit-logger.service';
import { EncryptionService } from './encryption.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Security')
@Controller('security')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class SecurityController {
  constructor(
    private readonly accessControlService: AccessControlService,
    private readonly auditLoggerService: AuditLoggerService,
    private readonly encryptionService: EncryptionService,
  ) {}

  @Get('permissions')
  @ApiOperation({ summary: 'Get user permissions' })
  @ApiResponse({ status: 200, description: 'Permissions retrieved successfully' })
  async getUserPermissions(@Req() req: any) {
    return this.accessControlService.getUserPermissions(req.user.id);
  }

  @Post('audit-logs')
  @ApiOperation({ summary: 'Create audit log entry' })
  @ApiResponse({ status: 201, description: 'Audit log created successfully' })
  async createAuditLog(@Body() body: any, @Req() req: any) {
    return this.auditLoggerService.createAuditLog(body, req.user.id);
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Get audit logs' })
  @ApiResponse({ status: 200, description: 'Audit logs retrieved successfully' })
  async getAuditLogs(@Req() req: any) {
    return this.auditLoggerService.getAuditLogs(req.user);
  }

  @Post('encrypt')
  @ApiOperation({ summary: 'Encrypt data' })
  @ApiResponse({ status: 200, description: 'Data encrypted successfully' })
  async encryptData(@Body() body: { data: string }, @Req() req: any) {
    const encrypted = await this.encryptionService.encrypt(body.data);
    return {
      success: true,
      data: { encrypted },
    };
  }

  @Post('decrypt')
  @ApiOperation({ summary: 'Decrypt data' })
  @ApiResponse({ status: 200, description: 'Data decrypted successfully' })
  async decryptData(@Body() body: { encrypted: string }, @Req() req: any) {
    const decrypted = await this.encryptionService.decrypt(body.encrypted);
    return {
      success: true,
      data: { decrypted },
    };
  }
}
