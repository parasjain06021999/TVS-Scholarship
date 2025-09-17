import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class DisbursePaymentDto {
  @IsString()
  paymentId: string;

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

  @IsString()
  @IsOptional()
  remarks?: string;
}
