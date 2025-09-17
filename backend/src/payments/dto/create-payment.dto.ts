import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  applicationId: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  bankName?: string;

  @IsString()
  @IsOptional()
  accountNumber?: string;

  @IsString()
  @IsOptional()
  ifscCode?: string;

  @IsString()
  @IsOptional()
  accountHolderName?: string;

  @IsObject()
  @IsOptional()
  metadata?: any;
}
