import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin();

    const { searchParams } = new URL(req.url);
    const days = Math.min(90, Math.max(1, parseInt(searchParams.get('days') || '30', 10)));

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get page views grouped by date
    const pageViews = await db.pageView.findMany({
      where: { createdAt: { gte: startDate } },
      select: {
        id: true,
        path: true,
        referrer: true,
        country: true,
        ip: true,
        userId: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date
    const dailyMap = new Map<string, { pageViews: number; uniqueVisitors: Set<string> }>();

    for (const pv of pageViews) {
      const dateKey = pv.createdAt.toISOString().slice(0, 10);
      const entry = dailyMap.get(dateKey) || { pageViews: 0, uniqueVisitors: new Set<string>() };
      entry.pageViews += 1;
      if (pv.ip) entry.uniqueVisitors.add(pv.ip);
      dailyMap.set(dateKey, entry);
    }

    const daily = Array.from(dailyMap.entries())
      .map(([date, data]) => ({
        date,
        pageViews: data.pageViews,
        uniqueVisitors: data.uniqueVisitors.size,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Top pages
    const pageMap = new Map<string, number>();
    for (const pv of pageViews) {
      pageMap.set(pv.path, (pageMap.get(pv.path) || 0) + 1);
    }
    const topPages = Array.from(pageMap.entries())
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Top referrers
    const referrerMap = new Map<string, number>();
    for (const pv of pageViews) {
      if (pv.referrer) {
        try {
          const url = new URL(pv.referrer);
          const domain = url.hostname;
          referrerMap.set(domain, (referrerMap.get(domain) || 0) + 1);
        } catch {
          // Invalid referrer URL, skip
        }
      }
    }
    const topReferrers = Array.from(referrerMap.entries())
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Summary KPIs
    const totalPageViews = pageViews.length;
    const uniqueVisitors = new Set(pageViews.filter(pv => pv.ip).map(pv => pv.ip!)).size;
    const loggedInVisits = pageViews.filter(pv => pv.userId).length;
    const bounceRate = totalPageViews > 0 ? Math.round((1 - loggedInVisits / totalPageViews) * 100 * 10) / 10 : 0;

    return NextResponse.json({
      daily,
      topPages,
      topReferrers,
      summary: {
        totalPageViews,
        uniqueVisitors,
        avgPageViewsPerDay: days > 0 ? Math.round(totalPageViews / days) : 0,
        bounceRate,
        period: `${days} days`,
      },
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json(
        { error: error.message === 'UNAUTHORIZED' ? 'Unauthorized' : 'Forbidden' },
        { status: error.message === 'UNAUTHORIZED' ? 401 : 403 }
      );
    }
    console.error('[Admin Analytics Traffic API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
