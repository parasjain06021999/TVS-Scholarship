import { IsString, IsOptional, IsEnum, IsObject } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsEnum(['INFO', 'SUCCESS', 'WARNING', 'ERROR'])
  type?: string;

  @IsOptional()
  @IsObject()
  data?: any;

  @IsOptional()
  @IsString()
  userId?: string;
}


