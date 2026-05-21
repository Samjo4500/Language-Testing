import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import { getAuthUser } from '@/lib/auth-middleware';

// Rate limit: 30 page view tracks per minute per IP
const trackLimiter = rateLimit({ windowMs: 60 * 1000, maxRequests: 30 });

/**
 * POST /api/track
 * Analytics tracking endpoint. Logs page views to the PageView model.
 * Body: { path: string, referrer?: string }
 * Also captures IP from x-forwarded-for header and user-agent.
 *
 * SECURITY: userId is now derived from the authenticated user's JWT token,
 * not from the request body. This prevents IDOR and analytics spam.
 */
export async function POST(request: NextRequest) {
  // Rate limit tracking to prevent analytics spam
  const limitError = trackLimiter(request);
  if (limitError) return limitError;
  try {
    const body = await request.json();
    const { path, referrer } = body;

    if (!path || typeof path !== 'string') {
      return NextResponse.json(
        { error: 'path is required.' },
        { status: 400 }
      );
    }

    // Validate path format (prevent injection)
    if (path.length > 500 || !path.startsWith('/')) {
      return NextResponse.json(
        { error: 'Invalid path format.' },
        { status: 400 }
      );
    }

    // Derive userId from the authenticated user's token — never trust client-sent userId
    const authUser = getAuthUser(request);
    const userId = authUser?.userId || null;

    // Capture IP from x-forwarded-for header
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : null;

    // Capture user-agent
    const userAgent = request.headers.get('user-agent') || null;

    await db.pageView.create({
      data: {
        path,
        referrer: referrer || null,
        ip: ip || null,
        userId,
        userAgent,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Track error:', error);
    return NextResponse.json(
      { error: 'Failed to track page view.' },
      { status: 500 }
    );
  }
}
