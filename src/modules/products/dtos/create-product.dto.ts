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

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  @ApiProperty({ required: true, example: 'White Rice 5kg' })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: 'Premium long-grain white rice, 5kg package',
  })
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @ApiProperty({ required: true, example: 24.99 })
  price: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({
    required: true,
    example: 120,
    minimum: 0,
    description: 'Available units in inventory',
  })
  currentStock: number;

  @IsString()
  @MinLength(2)
  @ApiProperty({ required: true, example: 'Groceries' })
  category: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  @ApiProperty({
    required: false,
    enum: ProductStatus,
    example: ProductStatus.ACTIVE,
    default: ProductStatus.ACTIVE,
  })
  status?: string;
}
