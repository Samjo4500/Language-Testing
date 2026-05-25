import { NextResponse } from 'next/server';

const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

// Use secure cookies only when the site is served over HTTPS.
// When behind an HTTP proxy (e.g. Caddy on port 81 without TLS),
// secure cookies will NEVER be sent by the browser, breaking auth entirely.
const IS_HTTPS = process.env.COOKIE_SECURE === 'true';

const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_HTTPS,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24, // 24 hours
};

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_HTTPS,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 30, // 30 days
};

export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
): NextResponse {
  response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, ACCESS_COOKIE_OPTIONS);
  response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, REFRESH_COOKIE_OPTIONS);
  return response;
}

export function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.set(ACCESS_TOKEN_COOKIE, '', { httpOnly: true, secure: IS_HTTPS, sameSite: 'lax', path: '/', maxAge: 0 });
  response.cookies.set(REFRESH_TOKEN_COOKIE, '', { httpOnly: true, secure: IS_HTTPS, sameSite: 'lax', path: '/', maxAge: 0 });
  return response;
}
