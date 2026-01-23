import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { StockMovementsModule } from './modules/stock-movements/stock-movements.module';
import { AppController } from './app.controller';
import { AuthModule } from '@auth/auth.module';
import { EnvironmentModule } from './modules/environment.module';
import { DatabaseModule } from './modules/database.module';

@Module({
  imports: [
    EnvironmentModule,
    DatabaseModule,
    UsersModule,
    ProductsModule,
    StockMovementsModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
