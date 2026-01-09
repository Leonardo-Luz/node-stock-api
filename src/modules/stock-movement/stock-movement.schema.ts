import { StockMovementReason } from '@enums/stock-movement-reason.enum';
import { StockMovementType } from '@enums/stock-movement-type.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StockMovementDocument = HydratedDocument<StockMovement>;

@Schema({ timestamps: true, collection: 'stockMovement' })
export class StockMovement {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true, min: 0 })
  quantity: number;

  @Prop({ required: true, type: String, enum: StockMovementType, index: true })
  type: StockMovementType;

  @Prop({ required: true, type: String, enum: StockMovementReason, index: true })
  reason: StockMovementReason;

  @Prop({ required: true, index: true })
  createdBy: string;
}

export const StockMovementSchema = SchemaFactory.createForClass(StockMovement);
