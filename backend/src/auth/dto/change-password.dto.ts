import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password',
    example: 'currentPassword123',
  })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description: 'New password',
    example: 'newPassword123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'New password must be at least 6 characters long' })
  newPassword: string;
}
