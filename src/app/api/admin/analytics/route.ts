import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';
import { adminLimiter } from '@/lib/rate-limit';

/**
 * GET /api/admin/analytics
 * Returns comprehensive analytics data for the admin dashboard.
 * Includes KPIs, daily page views, daily signups, conversion funnel,
 * CEFR level distribution, and top pages.
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

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thirtyDaysAgo = new Date(todayStart);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

    // ── KPIs ──────────────────────────────────────────────────────
    const [
      totalUsers,
      totalAssessments,
      completedAssessments,
      totalRevenueResult,
      totalCertificates,
      todaySignups,
      todayAssessments,
      todayRevenueResult,
    ] = await Promise.all([
      db.user.count(),
      db.assessment.count(),
      db.assessment.count({ where: { status: 'completed' } }),
      db.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'completed' },
      }),
      db.certificate.count(),
      db.user.count({ where: { createdAt: { gte: todayStart } } }),
      db.assessment.count({ where: { completedAt: { gte: todayStart } } }),
      db.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'completed', createdAt: { gte: todayStart } },
      }),
    ]);

    const kpis = {
      totalUsers,
      totalAssessments,
      completedAssessments,
      totalRevenue: totalRevenueResult._sum.amount ?? 0,
      totalCertificates,
      todaySignups,
      todayAssessments,
      todayRevenue: todayRevenueResult._sum.amount ?? 0,
    };

    // ── Daily Page Views (last 30 days) ──────────────────────────
    const pageViewsRaw = await db.pageView.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
    });

    const dailyPageViews: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date(thirtyDaysAgo);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      dailyPageViews[key] = 0;
    }
    for (const pv of pageViewsRaw) {
      const key = pv.createdAt.toISOString().split('T')[0];
      if (key in dailyPageViews) {
        dailyPageViews[key]++;
      }
    }

    // ── Daily Signups (last 30 days) ─────────────────────────────
    const signupsRaw = await db.user.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
    });

    const dailySignups: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date(thirtyDaysAgo);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      dailySignups[key] = 0;
    }
    for (const u of signupsRaw) {
      const key = u.createdAt.toISOString().split('T')[0];
      if (key in dailySignups) {
        dailySignups[key]++;
      }
    }

    // ── Conversion Funnel ────────────────────────────────────────
    const uniqueVisitors = await db.pageView.groupBy({
      by: ['ip'],
      where: { createdAt: { gte: thirtyDaysAgo } },
    });
    const signupsInPeriod = await db.user.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    });
    const assessmentsInPeriod = await db.assessment.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    });
    const certificatesInPeriod = await db.certificate.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    });

    const conversionFunnel = {
      visitors: uniqueVisitors.length,
      signups: signupsInPeriod,
      assessments: assessmentsInPeriod,
      certificates: certificatesInPeriod,
    };

    // ── CEFR Level Distribution ──────────────────────────────────
    const cefrDistributionRaw = await db.assessment.groupBy({
      by: ['cefrLevel'],
      where: { status: 'completed', cefrLevel: { not: null } },
      _count: { cefrLevel: true },
    });

    const cefrDistribution: Record<string, number> = {};
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    for (const level of levels) {
      cefrDistribution[level] = 0;
    }
    for (const row of cefrDistributionRaw) {
      if (row.cefrLevel && row.cefrLevel in cefrDistribution) {
        cefrDistribution[row.cefrLevel] = row._count.cefrLevel;
      }
    }

    // ── Top Pages by View Count ──────────────────────────────────
    const topPagesRaw = await db.pageView.groupBy({
      by: ['path'],
      _count: { path: true },
      orderBy: { _count: { path: 'desc' } },
      take: 20,
    });

    const topPages = topPagesRaw.map((row) => ({
      path: row.path,
      views: row._count.path,
    }));

    return NextResponse.json({
      kpis,
      dailyPageViews,
      dailySignups,
      conversionFunnel,
      cefrDistribution,
      topPages,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data.' },
      { status: 500 }
    );
  }
}
