import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/csp-report
 *
 * Receives Content Security Policy violation reports from the browser.
 * These reports help identify:
 * - XSS attack attempts blocked by CSP
 * - Legitimate resources being blocked (false positives)
 * - Third-party scripts trying to load unexpected content
 *
 * The browser sends these reports automatically when a CSP directive is violated
 * and a `report-uri` or `report-to` directive is configured.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log the CSP violation for monitoring
    console.warn('[CSP Violation]', {
      timestamp: new Date().toISOString(),
      'document-uri': body['csp-report']?.['document-uri'] || 'unknown',
      'violated-directive': body['csp-report']?.['violated-directive'] || 'unknown',
      'blocked-uri': body['csp-report']?.['blocked-uri'] || 'unknown',
      'source-file': body['csp-report']?.['source-file'] || 'unknown',
      'line-number': body['csp-report']?.['line-number'] || 'unknown',
    });

    // In production, you could forward this to a monitoring service like Sentry
    // or store in a database for analysis. For now, we just log it.

    return NextResponse.json({ received: true }, { status: 204 });
  } catch {
    // Malformed report — still acknowledge it
    return NextResponse.json({ received: true }, { status: 204 });
  }
}
