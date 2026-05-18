import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter (resets on server restart)
// For production, use Redis or Vercel KV
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

interface RateLimitOptions {
  windowMs: number;   // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

const DEFAULT_OPTIONS: RateLimitOptions = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10,      // 10 requests per minute
};

// Stricter limits for sensitive endpoints
const AUTH_LIMITS: RateLimitOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,             // 5 attempts per 15 min
};

const CONTACT_LIMITS: RateLimitOptions = {
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3,             // 3 submissions per hour
};

/**
 * Get client IP from request headers
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIp) return realIp.trim();
  return 'unknown';
}

/**
 * Check rate limit for a given key
 * Returns { allowed: boolean, retryAfterMs: number }
 */
export function checkRateLimit(key: string, options: RateLimitOptions = DEFAULT_OPTIONS): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (entry.count >= options.maxRequests) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count++;
  return { allowed: true, retryAfterMs: 0 };
}

/**
 * Rate limit middleware for API routes
 * Usage: const rateLimitResult = rateLimit(request, 'login', AUTH_LIMITS);
 *        if (!rateLimitResult.allowed) return rateLimitResult.response;
 */
export function rateLimit(
  request: NextRequest,
  endpoint: string,
  options: RateLimitOptions = DEFAULT_OPTIONS
): { allowed: boolean; response?: NextResponse; retryAfterMs: number } {
  const ip = getClientIp(request);
  const key = `${endpoint}:${ip}`;
  const result = checkRateLimit(key, options);

  if (!result.allowed) {
    return {
      allowed: false,
      retryAfterMs: result.retryAfterMs,
      response: NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil(result.retryAfterMs / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil(result.retryAfterMs / 1000)),
            'X-RateLimit-Limit': String(options.maxRequests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil((Date.now() + result.retryAfterMs) / 1000)),
          },
        }
      ),
    };
  }

  return { allowed: true, retryAfterMs: 0 };
}

// Periodically clean up old entries (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap) {
      if (now > entry.resetAt) rateLimitMap.delete(key);
    }
  }, 5 * 60 * 1000);
}

export { AUTH_LIMITS, CONTACT_LIMITS };
