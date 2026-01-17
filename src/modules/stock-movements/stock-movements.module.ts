import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StockMovementsService } from './stock-movements.service';
import { StockMovementsController } from './stock-movements.controller';
import { StockMovement, StockMovementSchema } from './stock-movement.schema';
import { StockMovementRepository } from './stock-movement.repository';
import { ProductsModule } from '@products/products.module';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StockMovement.name, schema: StockMovementSchema },
    ]),
    ProductsModule,
    UsersModule
  ],
  providers: [StockMovementsService, StockMovementRepository],
  controllers: [StockMovementsController],
  exports: [StockMovementsService],
})
export class StockMovementsModule { }
