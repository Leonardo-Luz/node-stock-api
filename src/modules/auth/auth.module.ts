import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { UsersModule } from '../users/users.module';

import { LocalStrategy } from './strategies/local.strategy';
import { AccessStrategy } from './strategies/access.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,

    PassportModule.register({
      session: false,
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_SECRET'),
        expiresIn: configService.get<string>('ACCESS_TOKEN_EXP') ? parseInt(configService.get<string>('ACCESS_TOKEN_EXP')!) : 15 * 60 * 1000,
      }),
      inject: [ConfigService],
      global: false,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    AccessStrategy,
    RefreshStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule { }
