import { Response } from 'express';

export const ACCESS_COOKIE = 'access-token';
export const REFRESH_COOKIE = 'refresh-token';

export function setAccessCookie(res: Response, token: string) {
  res.cookie(ACCESS_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: process.env.ACCESS_TOKEN_EXP ? parseInt(process.env.ACCESS_TOKEN_EXP) : 15 * 60 * 1000,
  });
}

export function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/api/v1/auth',
    maxAge: process.env.REFRESH_TOKEN_EXP ? parseInt(process.env.REFRESH_TOKEN_EXP) : 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie(ACCESS_COOKIE);
  res.clearCookie(REFRESH_COOKIE, { path: '/api/v1/auth' });
}
