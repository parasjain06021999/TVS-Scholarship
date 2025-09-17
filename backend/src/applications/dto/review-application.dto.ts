import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApplicationStatus } from '@prisma/client';

export class ReviewApplicationDto {
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsString()
  reviewerNotes?: string;
}

