import { StockMovementReason } from '@enums/stock-movement-reason.enum';
import { StockMovementType } from '@enums/stock-movement-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsMongoId, IsOptional, Max, Min } from 'class-validator';

export class FindStockMovementQueryDto {
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
  @IsMongoId()
  @ApiProperty({ required: false })
  productId?: string;

  @IsOptional()
  @IsEnum(StockMovementType)
  @ApiProperty({ required: false, type: String, enum: StockMovementType })
  type?: StockMovementType;

  @IsOptional()
  @IsEnum(StockMovementReason)
  @ApiProperty({ required: false, type: String, enum: StockMovementReason })
  reason?: StockMovementReason;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ required: false })
  createdBy?: string;
}
