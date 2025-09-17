import { IsString, IsNumber, IsEnum, IsBoolean, IsDateString, IsArray, IsOptional, Min, Max } from 'class-validator';
import { ScholarshipCategory } from '@prisma/client';

export class CreateScholarshipDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  eligibilityCriteria: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  maxAmount?: number;

  @IsEnum(ScholarshipCategory)
  category: ScholarshipCategory;

  @IsString()
  @IsOptional()
  subCategory?: string;

  @IsDateString()
  applicationStartDate: string;

  @IsDateString()
  applicationEndDate: string;

  @IsString()
  academicYear: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  maxApplications?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  currentApplications?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  documentsRequired?: string[];

  @IsNumber()
  @IsOptional()
  @Min(0)
  priority?: number;

  // createdBy is set automatically in the controller
}

