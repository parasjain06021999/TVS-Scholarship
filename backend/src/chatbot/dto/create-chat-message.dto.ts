import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateChatMessageDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsString()
  messageType?: string;
}
