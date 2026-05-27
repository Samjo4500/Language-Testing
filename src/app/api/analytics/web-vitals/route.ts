import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/analytics/web-vitals
 *
 * Receives Core Web Vitals metrics from the client-side
 * performance monitor. Logs them for analysis.
 *
 * In production, you would send these to a time-series DB
 * (e.g., Vercel Analytics, PostHog, Datadog).
 */
export async function POST(request: NextRequest) {
  try {
    const metric = await request.json();

    // Validate required fields
    if (!metric.name || typeof metric.value !== 'number') {
      return NextResponse.json({ error: 'Invalid metric' }, { status: 400 });
    }

    // In production, send to your analytics provider:
    // - Vercel Analytics: use @vercel/analytics track()
    // - PostHog: use posthog.capture()
    // - Custom: write to time-series DB

    // For now, just log at debug level (stripped in production by Next.js compiler)
    console.debug(
      `[Web Vital] ${metric.name}: ${Math.round(metric.value)}ms (${metric.rating}) — ${metric.url}`
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}
