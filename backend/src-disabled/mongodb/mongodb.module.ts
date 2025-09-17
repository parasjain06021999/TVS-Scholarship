import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { DocumentMetadata, DocumentMetadataSchema } from './schemas/document-metadata.schema';
import { AuditLog, AuditLogSchema } from './schemas/audit-log.schema';
import { ApplicationVersion, ApplicationVersionSchema } from './schemas/application-version.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: DocumentMetadata.name, schema: DocumentMetadataSchema },
      { name: AuditLog.name, schema: AuditLogSchema },
      { name: ApplicationVersion.name, schema: ApplicationVersionSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class MongodbModule {}
