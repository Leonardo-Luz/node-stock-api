import { ApiProperty } from '@nestjs/swagger';
import { StockMovementType } from '@enums/stock-movement-type.enum';
import { StockMovementReason } from '@enums/stock-movement-reason.enum';

export class GetStockMovementDto {
  @ApiProperty({ example: '695effb8efab678ec35554fd' })
  id: string;

  @ApiProperty({ required: true, example: '69616c3558a5f808452e616c' })
  productId: string;

  @ApiProperty({ required: true, example: 12 })
  quantity: number;

  @ApiProperty({
    required: true,
    type: String,
    enum: StockMovementType,
    example: StockMovementType.IN,
  })
  type: StockMovementType;

  @ApiProperty({
    required: true,
    type: String,
    enum: StockMovementReason,
    example: StockMovementReason.PURCHASE,
  })
  reason: StockMovementReason;

  @ApiProperty({ required: true, example: '69616b6b09612500b6b11faa' })
  createdBy: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
