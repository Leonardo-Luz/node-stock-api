import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from '@enums/product-status.enum';
import { Expose } from 'class-transformer';

export class GetProductDto {
  @Expose({ name: '_id' })
  @ApiProperty({ example: '695effb8efab678ec35554fd' })
  id: string;

  @Expose()
  @ApiProperty({ required: true, example: 'White Rice 5kg' })
  name: string;

  @Expose()
  @ApiProperty({
    required: false,
    example: 'Premium long-grain white rice, 5kg package',
  })
  description?: string;

  @Expose()
  @ApiProperty({ required: true, example: 24.99 })
  price: number;

  @Expose()
  @ApiProperty({
    required: true,
    example: 120,
    minimum: 0,
    description: 'Available units in inventory',
  })
  currentStock: number;

  @Expose()
  @ApiProperty({ required: true, example: 'Groceries' })
  category: string;

  @Expose()
  @ApiProperty({
    enum: ProductStatus,
    example: ProductStatus.ACTIVE,
    default: ProductStatus.ACTIVE,
  })
  status?: string;

  @Expose()
  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
