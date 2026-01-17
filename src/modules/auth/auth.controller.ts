import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { Public } from './decorators/public.decorator';
import {
  ApiBody,
  ApiCookieAuth,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import {
  clearAuthCookies,
  setAccessCookie,
  setRefreshCookie,
} from './auth.cookies';
import { GetPasswordUserDto } from '@users/dtos/get-password-user.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserRole } from '@enums/user-role.enum';

export class MeResponse {
  @ApiProperty({ example: '695effb8efab678ec35554fd' })
  id: string;

  @ApiProperty({ example: UserRole.VIEWER })
  role: UserRole;
}

export class SuccessResponse {
  @ApiProperty({ example: true })
  success: boolean;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  @ApiResponse({ type: SuccessResponse })
  async signUp(@Body() dto: SignUpDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: SignInDto })
  @ApiResponse({ type: SuccessResponse })
  async signIn(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as GetPasswordUserDto;

    const accessToken = await this.authService.getAccessToken(user);
    const refreshToken = await this.authService.getRefreshToken(user.id);

    setAccessCookie(res, accessToken);
    setRefreshCookie(res, refreshToken);

    return { success: true };
  }

  @UseGuards(RefreshAuthGuard)
  @Post('sign-out')
  @ApiCookieAuth('refresh-token')
  @ApiResponse({ type: SuccessResponse })
  async signOut(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as { id: string; role: string };

    await this.authService.logout(user.id);

    clearAuthCookies(res);

    return { success: true };
  }

  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  @ApiCookieAuth('refresh-token')
  @ApiResponse({ type: SuccessResponse })
  async regenerateTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as { id: string; role: string };

    const { accessToken, refreshToken } = await this.authService.refreshTokens(
      user.id,
    );

    setAccessCookie(res, accessToken);
    setRefreshCookie(res, refreshToken);

    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiCookieAuth('access-token')
  @ApiResponse({ type: MeResponse })
  me(@Req() req: Request) {
    return req.user;
  }
}
