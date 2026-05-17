import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * POST /api/track
 * Analytics tracking endpoint. Logs page views to the PageView model.
 * Body: { path: string, referrer?: string, userId?: string }
 * Also captures IP from x-forwarded-for header and user-agent.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, referrer, userId } = body;

    if (!path || typeof path !== 'string') {
      return NextResponse.json(
        { error: 'path is required.' },
        { status: 400 }
      );
    }

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
        userId: userId || null,
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
