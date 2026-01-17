import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GetUserDto } from '@users/dtos/get-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { JwtUserPayload } from './interfaces/jwt-user-payload.interface';
import { UserRepository } from '@users/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) { }

  async register(signUpDto: SignUpDto): Promise<GetUserDto> {
    return await this.userRepository.create(signUpDto);
  }

  async logout(userId: string) {
    await this.userRepository.updateRefreshToken(userId, null);
  }

  async validateCredentials(signInDto: SignInDto): Promise<GetUserDto> {
    const user = await this.userRepository.findByEmail(signInDto.email);

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

    await this.userRepository.updateRefreshToken(userId, hashedRefreshToken);

    return refreshToken;
  }

  async refreshTokens(userId: string) {
    const user = await this.userRepository.findById(userId);

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
