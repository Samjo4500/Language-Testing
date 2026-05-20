import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';
import { adminLimiter } from '@/lib/rate-limit';

/**
 * GET /api/admin/apis
 * Returns API health status, endpoint usage stats, and configuration.
 */
export async function GET(request: NextRequest) {
  // Rate limit: 60 requests per minute per IP
  const limitError = adminLimiter(request);
  if (limitError) return limitError;

  try {
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const adminCheck = requireAdmin(authResult);
    if (adminCheck) return adminCheck;

    // API endpoint health checks
    const apiEndpoints = [
      { path: '/api/auth/login', method: 'POST', description: 'User authentication' },
      { path: '/api/auth/register', method: 'POST', description: 'User registration' },
      { path: '/api/auth/me', method: 'GET', description: 'Get current user' },
      { path: '/api/auth/refresh', method: 'POST', description: 'Refresh access token' },
      { path: '/api/auth/forgot-password', method: 'POST', description: 'Password reset request' },
      { path: '/api/assessments/start', method: 'POST', description: 'Start assessment' },
      { path: '/api/assessments/submit', method: 'POST', description: 'Submit assessment' },
      { path: '/api/certificates/generate', method: 'POST', description: 'Generate certificate' },
      { path: '/api/payments/create-order', method: 'POST', description: 'Create PayPal order' },
      { path: '/api/payments/capture', method: 'POST', description: 'Capture PayPal payment' },
      { path: '/api/admin/analytics', method: 'GET', description: 'Admin analytics' },
      { path: '/api/admin/users', method: 'GET', description: 'Admin user list' },
      { path: '/api/admin/payments', method: 'GET', description: 'Admin payment list' },
      { path: '/api/admin/assessments', method: 'GET', description: 'Admin assessment list' },
      { path: '/api/admin/system', method: 'GET', description: 'System health check' },
    ];

    // API usage stats from page views
    const apiPageViews = await db.pageView.findMany({
      where: { path: { startsWith: '/api/' } },
      select: { path: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });

    // Count API calls by path
    const apiCallCounts: Record<string, number> = {};
    for (const pv of apiPageViews) {
      apiCallCounts[pv.path] = (apiCallCounts[pv.path] || 0) + 1;
    }

    const topApiCalls = Object.entries(apiCallCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([path, count]) => ({ path, count }));

    // Database health check
    const dbStart = Date.now();
    await db.user.count();
    const dbLatency = Date.now() - dbStart;

    // Assessment API stats
    const [
      totalAssessments,
      completedAssessments,
      inProgressAssessments,
      todayAssessments,
      avgCompletionTime,
    ] = await Promise.all([
      db.assessment.count(),
      db.assessment.count({ where: { status: 'completed' } }),
      db.assessment.count({ where: { status: 'in_progress' } }),
      db.assessment.count({
        where: {
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      db.assessment.findMany({
        where: { status: 'completed', startedAt: { not: null }, completedAt: { not: null } },
        select: { startedAt: true, completedAt: true },
        orderBy: { completedAt: 'desc' },
        take: 100,
      }),
    ]);

    // Calculate average completion time in minutes
    let avgMinutes = 0;
    if (avgCompletionTime.length > 0) {
      const totalMinutes = avgCompletionTime.reduce((sum, a) => {
        if (a.startedAt && a.completedAt) {
          return sum + (new Date(a.completedAt).getTime() - new Date(a.startedAt).getTime()) / 60000;
        }
        return sum;
      }, 0);
      avgMinutes = Math.round((totalMinutes / avgCompletionTime.length) * 10) / 10;
    }

    // CEFR level distribution of completed assessments
    const cefrDistribution = await db.assessment.groupBy({
      by: ['cefrLevel'],
      where: { status: 'completed', cefrLevel: { not: null } },
      _count: { cefrLevel: true },
    });

    // Latest test takers (last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const latestTestTakers = await db.assessment.findMany({
      where: { createdAt: { gte: twentyFourHoursAgo } },
      select: {
        id: true,
        status: true,
        cefrLevel: true,
        score: true,
        startedAt: true,
        completedAt: true,
        createdAt: true,
        user: { select: { id: true, email: true, name: true, plan: true } },
        _count: { select: { responses: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Service configuration
    const services = {
      database: {
        status: dbLatency < 1000 ? 'healthy' : dbLatency < 3000 ? 'degraded' : 'unhealthy',
        latencyMs: dbLatency,
        type: 'PostgreSQL (Neon)',
      },
      auth: {
        jwtSecretSet: !!process.env.JWT_SECRET,
        provider: 'Custom JWT + bcrypt',
      },
      email: {
        provider: 'Resend',
        apiKeySet: !!process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.length > 0,
      },
      payment: {
        provider: 'PayPal',
        mode: process.env.PAYPAL_MODE || 'not configured',
        clientIdSet: !!process.env.PAYPAL_CLIENT_ID,
        secretSet: !!process.env.PAYPAL_SECRET,
      },
      ai: {
        provider: 'Google AI (Gemini)',
        apiKeySet: !!process.env.GOOGLE_AI_API_KEY,
      },
    };

    return NextResponse.json({
      apiEndpoints,
      topApiCalls,
      assessmentStats: {
        totalAssessments,
        completedAssessments,
        inProgressAssessments,
        todayAssessments,
        avgCompletionMinutes: avgMinutes,
        cefrDistribution: cefrDistribution.map((d) => ({
          level: d.cefrLevel,
          count: d._count.cefrLevel,
        })),
      },
      latestTestTakers,
      services,
    });
  } catch (error) {
    console.error('Admin APIs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API data.' },
      { status: 500 }
    );
  }
}
