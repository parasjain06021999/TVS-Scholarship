import { Module } from '@nestjs/common';
import { ScholarshipsService } from './scholarships.service';
import { ScholarshipsController } from './scholarships.controller';

@Module({
  providers: [ScholarshipsService],
  controllers: [ScholarshipsController],
  exports: [ScholarshipsService],
})
export class ScholarshipsModule {}
