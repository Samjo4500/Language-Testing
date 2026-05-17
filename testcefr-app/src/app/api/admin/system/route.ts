import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';

/**
 * GET /api/admin/system
 * Returns system health info including database stats, environment, uptime, and memory.
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const adminCheck = requireAdmin(authResult);
    if (adminCheck) return adminCheck;

    // ── Database table counts ─────────────────────────────────────
    const [users, questions, payments, assessments, certificates, pageViews] =
      await Promise.all([
        db.user.count(),
        db.question.count(),
        db.payment.count(),
        db.assessment.count(),
        db.certificate.count(),
        db.pageView.count(),
      ]);

    // ── Environment info ──────────────────────────────────────────
    const environment = {
      nodeVersion: process.version,
      platform: process.platform,
      env: process.env.NODE_ENV || 'development',
      googleAiKeySet: !!process.env.GOOGLE_AI_API_KEY,
      paypalMode: process.env.PAYPAL_MODE || 'sandbox',
      appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    };

    // ── Uptime ───────────────────────────────────────────────────
    const uptime = process.uptime();

    // ── Memory ───────────────────────────────────────────────────
    const memoryUsage = process.memoryUsage();
    const memory = {
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
    };

    // Estimate DB size based on row counts (rough approximation)
    // Average row sizes in KB: User~2KB, Question~1KB, Payment~1KB,
    // Assessment~1KB, Certificate~2KB, PageView~0.5KB
    const estimatedSizeMB =
      (users * 2 +
        questions * 1 +
        payments * 1 +
        assessments * 1 +
        certificates * 2 +
        pageViews * 0.5) /
      1024;

    return NextResponse.json({
      database: {
        tables: {
          users,
          questions,
          payments,
          assessments,
          certificates,
          pageViews,
        },
        sizeMB: Math.round(estimatedSizeMB * 100) / 100,
      },
      environment,
      uptime: Math.round(uptime),
      memory,
    });
  } catch (error) {
    console.error('System health error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system health.' },
      { status: 500 }
    );
  }
}
