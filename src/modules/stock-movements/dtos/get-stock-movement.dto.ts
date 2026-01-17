import { ApiProperty } from '@nestjs/swagger';
import { StockMovementType } from '@enums/stock-movement-type.enum';
import { StockMovementReason } from '@enums/stock-movement-reason.enum';
import { Expose, Type } from 'class-transformer';

export class GetStockMovementDto {
  @Expose({ name: '_id' })
  @Type(() => String)
  @ApiProperty({ example: '695effb8efab678ec35554fd' })
  id: string;

  @Expose()
  @ApiProperty({ required: true, example: '69616c3558a5f808452e616c' })
  productId: string;

  @Expose()
  @ApiProperty({ required: true, example: 12 })
  quantity: number;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    enum: StockMovementType,
    example: StockMovementType.IN,
  })
  type: StockMovementType;

  @Expose()
  @ApiProperty({
    required: true,
    type: String,
    enum: StockMovementReason,
    example: StockMovementReason.PURCHASE,
  })
  reason: StockMovementReason;

  @Expose()
  @ApiProperty({ required: true, example: '69616b6b09612500b6b11faa' })
  createdBy: string;

  @Expose()
  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
