import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { GetUserDto } from '../users/dtos/get-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { GetPasswordUserDto } from '../users/dtos/get-password-user.dto';
import { JwtUserPayload } from './interfaces/jwt-user-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(signUpDto: SignUpDto): Promise<GetUserDto> {
    return await this.usersService.create(signUpDto);
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
  }

  async validateCredentials(signInDto: SignInDto): Promise<GetPasswordUserDto> {
    const user = await this.usersService.findByEmail(signInDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(signInDto.password, user.password);

    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  public async getAccessToken(user: JwtUserPayload) {
    const payload = {
      sub: user.id,
      role: user.role,
    };

    const options = {
      secret: process.env.ACCESS_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXP || '1min',
    } as JwtSignOptions;

    return await this.jwtService.signAsync(payload, options);
  }

  public async getRefreshToken(userId: string): Promise<string> {
    const payload = {
      sub: userId,
    };

    const options = {
      secret: process.env.REFRESH_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXP || '7d',
    } as JwtSignOptions;

    const refreshToken = await this.jwtService.signAsync(payload, options);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);

    await this.usersService.updateRefreshToken(userId, hashedRefreshToken);

    return refreshToken;
  }

  async refreshTokens(userId: string) {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    const accessToken = await this.getAccessToken(user);
    const refreshToken = await this.getRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
    };
  }
}
