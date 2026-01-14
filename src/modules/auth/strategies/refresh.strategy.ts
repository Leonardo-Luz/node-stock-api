import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '@users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '@auth/interfaces/jwt-payload.interface';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private readonly usersService: UsersService) {
    super({
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: process.env.REFRESH_SECRET!,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies['refresh-token'] as string,
      ]),
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.cookies['refresh-token'] as string;

    const user = await this.usersService.findByIdWithRefreshToken(payload.sub);

    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException();
    }

    const valid = await bcrypt.compare(refreshToken, user.hashedRefreshToken);

    if (!valid) {
      await this.usersService.updateRefreshToken(payload.sub, null);
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      role: user.role,
    };
  }
}
