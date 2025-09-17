import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsEnum, IsPhoneNumber, IsNumber } from 'class-validator';
import { Gender } from '@prisma/client';

export class UpdateStudentDto {
  @ApiProperty({
    description: 'Student first name',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Student last name',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'Student date of birth',
    example: '2000-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({
    description: 'Student gender',
    enum: Gender,
    example: Gender.MALE,
    required: false,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({
    description: 'Student phone number',
    example: '+91-9876543210',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber('IN')
  phone?: string;

  @ApiProperty({
    description: 'Student address',
    example: '123 Main Street, Area Name',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Student city',
    example: 'Mumbai',
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    description: 'Student state',
    example: 'Maharashtra',
    required: false,
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    description: 'Student pincode',
    example: '400001',
    required: false,
  })
  @IsOptional()
  @IsString()
  pincode?: string;

  @ApiProperty({
    description: 'Student country',
    example: 'India',
    required: false,
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    description: 'Aadhar number',
    example: '123456789012',
    required: false,
  })
  @IsOptional()
  @IsString()
  aadharNumber?: string;

  @ApiProperty({
    description: 'PAN number',
    example: 'ABCDE1234F',
    required: false,
  })
  @IsOptional()
  @IsString()
  panNumber?: string;

  @ApiProperty({
    description: 'Father name',
    example: 'Robert Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  fatherName?: string;

  @ApiProperty({
    description: 'Father occupation',
    example: 'Engineer',
    required: false,
  })
  @IsOptional()
  @IsString()
  fatherOccupation?: string;

  @ApiProperty({
    description: 'Mother name',
    example: 'Jane Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  motherName?: string;

  @ApiProperty({
    description: 'Mother occupation',
    example: 'Teacher',
    required: false,
  })
  @IsOptional()
  @IsString()
  motherOccupation?: string;

  @ApiProperty({
    description: 'Family income',
    example: 500000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  familyIncome?: number;

  @ApiProperty({
    description: 'Emergency contact',
    example: '+91-9876543210',
    required: false,
  })
  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @ApiProperty({
    description: 'Profile image URL',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  profileImage?: string;
}
