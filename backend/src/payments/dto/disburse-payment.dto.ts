import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';

export class DisbursePaymentDto {
  @IsString()
  applicationId: string;

  @IsNumber()
  amount: number;

  @IsString()
  bankName: string;

  @IsString()
  accountNumber: string;

  @IsString()
  ifscCode: string;

  @IsString()
  accountHolderName: string;

  @IsObject()
  @IsOptional()
  metadata?: any;
}
