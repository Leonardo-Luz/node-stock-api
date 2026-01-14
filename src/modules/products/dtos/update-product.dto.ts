import { ProductStatus } from '@enums/product-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @ApiProperty({ required: false, example: 'White Rice 5kg' })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: 'Premium long-grain white rice, 5kg package',
  })
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @ApiProperty({ required: false, example: 24.99 })
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    required: false,
    example: 120,
    minimum: 0,
    description: 'Available units in inventory',
  })
  currentStock?: number;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @ApiProperty({ required: false, example: 'Groceries' })
  category?: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  @ApiProperty({
    enum: ProductStatus,
    example: ProductStatus.ACTIVE,
    default: ProductStatus.ACTIVE,
  })
  status?: string;
}
