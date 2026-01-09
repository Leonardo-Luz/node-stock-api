import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@enums/user-role.enum';
import { IsDate, IsEmail, IsEnum, IsMongoId, IsString } from 'class-validator';

export class GetUserDto {
  @IsMongoId()
  @ApiProperty({ example: '695effb8efab678ec35554fd' })
  id: string;

  @IsString()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @IsEmail()
  @ApiProperty({ example: 'john@mail.com' })
  email: string;

  @IsEnum(UserRole)
  @ApiProperty({ enum: UserRole, example: UserRole.VIEWER })
  role: UserRole;

  @IsDate()
  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @IsDate()
  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
