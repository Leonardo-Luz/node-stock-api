import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import validationConfig from './config/validation.config';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { StockMovementsModule } from './modules/stock-movements/stock-movements.module';
import { AppController } from './app.controller';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [validationConfig],
      envFilePath: [
        `.env.${process.env.NODE_ENV}`,
        `.env.${process.env.NODE_ENV}.local`,
        '.env.local',
      ],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    ProductsModule,
    StockMovementsModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
