import { StockMovementReason } from '@enums/stock-movement-reason.enum';
import { StockMovementType } from '@enums/stock-movement-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional } from 'class-validator';

export class FindStockMovementQueryDto {
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
