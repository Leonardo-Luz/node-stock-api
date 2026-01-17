import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@enums/user-role.enum';
import { Expose, Type } from 'class-transformer';

export class GetUserDto {
  @Expose({ name: '_id' })
  @Type(() => String)
  @ApiProperty({ example: '695effb8efab678ec35554fd' })
  id: string;

  @Expose()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'john@mail.com' })
  email: string;

  @Expose()
  @ApiProperty({ enum: UserRole, example: UserRole.VIEWER })
  role: UserRole;

  @Expose()
  @ApiProperty({ example: 'p3dtY2weXFYsZOkCSU4EX1XJOriaplsnZR8/AwMot5I=' })
  password: string;

  @Expose()
  @ApiProperty({ required: false })
  hashedRefreshToken?: string;

  @Expose()
  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
