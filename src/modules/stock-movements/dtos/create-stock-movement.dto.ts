import { StockMovementReason } from '@enums/stock-movement-reason.enum';
import { StockMovementType } from '@enums/stock-movement-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsMongoId, IsNumber, Min } from 'class-validator';

export class CreateStockMovementDto {
  @IsMongoId()
  @ApiProperty({ required: true, example: '69616c3558a5f808452e616c' })
  productId: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiProperty({ required: true, example: 12 })
  quantity: number;

  @IsEnum(StockMovementType)
  @ApiProperty({ required: true, type: String, enum: StockMovementType, example: StockMovementType.IN })
  type: StockMovementType;

  @IsEnum(StockMovementReason)
  @ApiProperty({ required: true, type: String, enum: StockMovementReason, example: StockMovementReason.PURCHASE })
  reason: StockMovementReason;

  @IsMongoId()
  @ApiProperty({ required: true, example: '69616b6b09612500b6b11faa' })
  createdBy: string;
}
