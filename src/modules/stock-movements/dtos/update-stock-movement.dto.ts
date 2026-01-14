import { StockMovementReason } from '@enums/stock-movement-reason.enum';
import { StockMovementType } from '@enums/stock-movement-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsMongoId, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateStockMovementDto {
  @IsOptional()
  @IsMongoId()
  @ApiProperty({ required: false, example: '69616c3558a5f808452e616c' })
  productId?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiProperty({ required: false, example: 12 })
  quantity?: number;

  @IsOptional()
  @IsEnum(StockMovementType)
  @ApiProperty({
    required: false,
    type: String,
    enum: StockMovementType,
    example: StockMovementType.IN,
  })
  type?: StockMovementType;

  @IsOptional()
  @IsEnum(StockMovementReason)
  @ApiProperty({
    required: false,
    type: String,
    enum: StockMovementReason,
    example: StockMovementReason.PURCHASE,
  })
  reason?: StockMovementReason;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ required: false, example: '69616b6b09612500b6b11faa' })
  createdBy?: string;
}
