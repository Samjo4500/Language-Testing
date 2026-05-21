import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/csp-report
 * Receives Content Security Policy violation reports from browsers.
 * This endpoint is referenced in the CSP header's report-uri directive.
 *
 * In production, you could forward these to Sentry, a logging service,
 * or store them in the database for monitoring. For now, we log them
 * to the server console so they appear in Vercel logs.
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    let report: unknown;
    if (contentType.includes('application/csp-report')) {
      const text = await request.text();
      try {
        report = JSON.parse(text);
      } catch {
        report = text;
      }
    } else if (contentType.includes('application/json')) {
      report = await request.json();
    } else {
      // Some browsers send as text/plain
      const text = await request.text();
      try {
        report = JSON.parse(text);
      } catch {
        report = text;
      }
    }

    // Log the CSP violation for monitoring in Vercel logs
    console.warn('[CSP Violation]', JSON.stringify(report, null, 2));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    // Don't fail on CSP report errors — they're best-effort
    console.error('[CSP Report Error]', error);
    return new NextResponse(null, { status: 204 });
  }
}
