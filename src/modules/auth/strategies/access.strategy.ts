import { JwtPayload } from '@auth/interfaces/jwt-payload.interface';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies['access-token'] as string,
      ]),
      secretOrKey: process.env.ACCESS_SECRET!,
    });
  }

  validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      role: payload.role,
    };
  }
}
