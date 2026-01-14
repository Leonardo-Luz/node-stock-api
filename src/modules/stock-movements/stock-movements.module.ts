import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StockMovementsService } from './stock-movements.service';
import { StockMovementsController } from './stock-movements.controller';
import { StockMovement, StockMovementSchema } from './stock-movement.schema';
import { Product, ProductSchema } from '../products/product.schema';
import { User, UserSchema } from '../users/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StockMovement.name, schema: StockMovementSchema },
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [StockMovementsService],
  controllers: [StockMovementsController],
  exports: [StockMovementsService],
})
export class StockMovementsModule {}
