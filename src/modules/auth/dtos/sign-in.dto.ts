import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @ApiProperty({ example: 'john@mail.com' })
  email: string;

  @IsStrongPassword()
  @MinLength(6)
  @ApiProperty({ example: 'sEcure-p@ssw0rd' })
  password: string;
}

