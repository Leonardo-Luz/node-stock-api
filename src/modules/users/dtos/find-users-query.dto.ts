import { UserRole } from '@enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export class FindUsersQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ required: false, example: 1 })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  @ApiProperty({ required: false, example: 10 })
  limit?: number = 10;

  @IsOptional()
  @IsEnum(UserRole)
  @ApiProperty({ required: false, enum: UserRole, example: UserRole.VIEWER })
  role?: UserRole;
}
