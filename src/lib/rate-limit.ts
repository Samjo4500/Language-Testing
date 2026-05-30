import { NextRequest, NextResponse } from 'next/server';

/**
 * Simple in-memory rate limiter for Vercel serverless.
 * Note: In-memory limits are per-instance (cold starts reset them).
 * For production, consider Vercel KV or Upstash for distributed rate limiting.
 * This provides a baseline defense against abuse.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up expired entries every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
      if (now > entry.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 10 * 60 * 1000);
}

export function rateLimit(options: {
  windowMs: number;
  maxRequests: number;
}): (request: NextRequest) => NextResponse | null {
  const { windowMs, maxRequests } = options;

  return (request: NextRequest): NextResponse | null => {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';
    const key = `${ip}:${request.nextUrl.pathname}`;
    const now = Date.now();

    const entry = rateLimitMap.get(key);

    if (!entry || now > entry.resetTime) {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return null;
    }

    entry.count++;
    if (entry.count > maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((entry.resetTime - now) / 1000)) } }
      );
    }

    return null;
  };
}

// Pre-configured rate limiters for common use cases
export const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 10 }); // 10 auth attempts per 15 min
export const aiChatLimiter = rateLimit({ windowMs: 60 * 1000, maxRequests: 20 });     // 20 chat messages per min
export const aiEvalLimiter = rateLimit({ windowMs: 60 * 1000, maxRequests: 10 });     // 10 AI evaluations per min
export const assessmentLimiter = rateLimit({ windowMs: 60 * 1000, maxRequests: 5 });   // 5 assessment starts per min
export const adminLimiter = rateLimit({ windowMs: 60 * 1000, maxRequests: 60 });       // 60 admin API calls per min
export const paymentLimiter = rateLimit({ windowMs: 60 * 1000, maxRequests: 5 });       // 5 payment requests per min
export const tokenRefreshLimiter = rateLimit({ windowMs: 60 * 1000, maxRequests: 30 }); // 30 refreshes per min
export const certificateLimiter = rateLimit({ windowMs: 60 * 1000, maxRequests: 10 });  // 10 cert downloads per min
export const webVitalsLimiter = rateLimit({ windowMs: 60 * 1000, maxRequests: 30 });    // 30 web vitals per min
export const ttsLimiter = rateLimit({ windowMs: 60 * 1000, maxRequests: 10 });         // 10 TTS requests per min
