import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// JWT_SECRET must be set in environment — fail hard if missing
// Centralized getter: all routes should use this instead of reading process.env directly
// Uses lazy evaluation so the env var is read at call time, not at module load time
let _cachedSecret: string | undefined;
export function getJwtSecret(): string {
  if (_cachedSecret === undefined) {
    _cachedSecret = process.env.JWT_SECRET || '';
    if (!_cachedSecret) {
      console.error('FATAL: JWT_SECRET environment variable is not set. Authentication will not work.');
    }
  }
  return _cachedSecret;
}

const ACCESS_TOKEN_EXPIRY = '24h';
const REFRESH_TOKEN_EXPIRY = '30d';

export interface TokenPayload {
  userId: string;
  email: string;
  plan: string;
  role?: string; // "user" | "admin"
  tokenVersion?: number; // incremented on logout/password change to invalidate old tokens
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: ACCESS_TOKEN_EXPIRY });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: REFRESH_TOKEN_EXPIRY });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}

export function generateTokens(payload: TokenPayload): { accessToken: string; refreshToken: string } {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}
