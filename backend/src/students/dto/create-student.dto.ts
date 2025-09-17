import { IsString, IsEmail, IsOptional, IsDateString, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { Gender } from '@prisma/client';

export class CreateStudentDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsDateString()
  dateOfBirth: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  pincode: string;

  @IsString()
  @IsOptional()
  aadharNumber?: string;

  @IsString()
  @IsOptional()
  panNumber?: string;

  @IsString()
  @IsOptional()
  fatherName?: string;

  @IsString()
  @IsOptional()
  motherName?: string;

  @IsNumber()
  @IsOptional()
  familyIncome?: number;

  @IsString()
  @IsOptional()
  profileImage?: string;

  @IsString()
  @IsOptional()
  educationLevel?: string;

  @IsString()
  @IsOptional()
  currentInstitution?: string;

  @IsString()
  @IsOptional()
  currentCourse?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(10)
  cgpa?: number;
}

