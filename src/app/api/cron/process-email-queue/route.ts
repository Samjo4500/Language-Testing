import { NextRequest, NextResponse } from 'next/server';
import { processEmailQueue } from '@/lib/email-queue';

/**
 * Cron endpoint to process the email queue.
 *
 * Called by Vercel Cron every 5 minutes (see vercel.json).
 * Can also be called manually with a secret token for testing.
 *
 * Security: Requires CRON_SECRET env var to prevent unauthorized calls.
 * Vercel automatically sends the CRON_SECRET header for cron triggers.
 */
export async function GET(request: NextRequest) {
  // Verify authorization
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // Fail-closed: if CRON_SECRET is set, it MUST match
  // If CRON_SECRET is not set, only allow in development mode
  if (cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Cron not configured' }, { status: 503 });
  }

  try {
    const result = await processEmailQueue();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...result,
    });
  } catch (error) {
    console.error('[cron/process-email-queue] Fatal error:', error);
    return NextResponse.json(
      { error: 'Internal server error', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request);
}
