import { ProductStatus } from "@enums/product-status.enum";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class FindProductsQueryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, example: 'Groceries' })
  category?: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  @ApiProperty({ required: false, enum: ProductStatus })
  status?: ProductStatus;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @ApiProperty({ required: false, example: 10 })
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @ApiProperty({ required: false, example: 100 })
  maxPrice?: number;
}
