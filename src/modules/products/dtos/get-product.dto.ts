import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from '@enums/product-status.enum';

export class GetProductDto {
  @ApiProperty({ example: '695effb8efab678ec35554fd' })
  id: string;

  @ApiProperty({ required: true, example: 'White Rice 5kg' })
  name: string;

  @ApiProperty({ required: false, example: 'Premium long-grain white rice, 5kg package' })
  description?: string;

  @ApiProperty({ required: true, example: 24.99 })
  price: number;

  @ApiProperty({
    required: true,
    example: 120,
    minimum: 0,
    description: 'Available units in inventory',
  })
  currentStock: number;

  @ApiProperty({ required: true, example: 'Groceries' })
  category: string;

  @ApiProperty({ enum: ProductStatus, example: ProductStatus.ACTIVE, default: ProductStatus.ACTIVE })
  status?: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
