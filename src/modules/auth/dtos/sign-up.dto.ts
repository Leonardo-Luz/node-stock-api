import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword, MinLength } from 'class-validator';

export class SignUpDto {
  @IsString()
  @MinLength(2)
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @IsEmail()
  @ApiProperty({ example: 'john@mail.com' })
  email: string;

  @IsStrongPassword()
  @MinLength(6)
  @ApiProperty({ example: 'sEcure-p@ssw0rd' })
  password: string;
}


