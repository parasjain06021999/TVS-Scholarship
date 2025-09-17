import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsDateString, IsEnum, IsOptional, IsPhoneNumber } from 'class-validator';
import { Gender } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'student@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({
    description: 'Student first name',
    example: 'John',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Student last name',
    example: 'Doe',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Student date of birth',
    example: '2000-01-01',
  })
  @IsDateString({}, { message: 'Please provide a valid date of birth' })
  dateOfBirth: string;

  @ApiProperty({
    description: 'Student gender',
    enum: Gender,
    example: Gender.MALE,
  })
  @IsEnum(Gender, { message: 'Please provide a valid gender' })
  gender: Gender;

  @ApiProperty({
    description: 'Student phone number',
    example: '+91-9876543210',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber('IN', { message: 'Please provide a valid Indian phone number' })
  phone?: string;

  @ApiProperty({
    description: 'Student address',
    example: '123 Main Street, Area Name',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Student city',
    example: 'Mumbai',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Student state',
    example: 'Maharashtra',
  })
  @IsString()
  state: string;

  @ApiProperty({
    description: 'Student pincode',
    example: '400001',
  })
  @IsString()
  pincode: string;
}
