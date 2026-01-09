import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @ApiPropertyOptional({ example: 'John Doe' })
  name?: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({ example: 'john@mail.com' })
  email?: string;

  @IsOptional()
  @MinLength(6)
  @ApiPropertyOptional({ minLength: 6 })
  password?: string;
}
