import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import validationConfig from './config/validation.config';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { StockMovementModule } from './modules/stock-movement/stock-movement.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [validationConfig],
      envFilePath: [
        `.env.${process.env.NODE_ENV}`,
        `.env.${process.env.NODE_ENV}.local`,
        '.env.local',
      ]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    ProductsModule,
    StockMovementModule,
  ]
})
export class AppModule { }
