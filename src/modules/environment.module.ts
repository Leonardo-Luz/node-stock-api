import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import validationConfig from 'src/config/validation.config';

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
  ],
})
export class EnvironmentModule { }
