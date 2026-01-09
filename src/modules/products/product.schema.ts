import { ProductStatus } from '@enums/product-status.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true, collection: 'products' })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 0 })
  currentStock: number;

  @Prop({ required: true, index: true })
  category: string;

  @Prop({ required: false, type: String, enum: ProductStatus, default: ProductStatus.ACTIVE, index: true })
  status: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
