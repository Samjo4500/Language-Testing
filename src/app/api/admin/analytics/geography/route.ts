import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin();

    // Get user geography from User.country field
    const [usersByCountry, pageViewsByCountry] = await Promise.all([
      db.user.groupBy({
        by: ['country'],
        _count: { country: true },
        where: { country: { not: null } },
        orderBy: { _count: { country: 'desc' } },
      }),
      db.pageView.groupBy({
        by: ['country'],
        _count: { country: true },
        where: { country: { not: null } },
        orderBy: { _count: { country: 'desc' } },
      }),
    ]);

    // Format user geography
    const userGeography = usersByCountry
      .filter((item) => item.country !== null)
      .map((item) => ({
        country: item.country!,
        users: item._count.country,
      }));

    // Format page view geography
    const pageViewGeography = pageViewsByCountry
      .filter((item) => item.country !== null)
      .map((item) => ({
        country: item.country!,
        pageViews: item._count.country,
      }));

    // Merge into a combined view
    const allCountries = new Set([
      ...userGeography.map((u) => u.country),
      ...pageViewGeography.map((p) => p.country),
    ]);

    const userMap = new Map(userGeography.map((u) => [u.country, u.users]));
    const pvMap = new Map(pageViewGeography.map((p) => [p.country, p.pageViews]));

    const combined = Array.from(allCountries)
      .map((country) => ({
        country,
        users: userMap.get(country) || 0,
        pageViews: pvMap.get(country) || 0,
      }))
      .sort((a, b) => b.users - a.users);

    // Top countries by revenue
    const paymentsByCountry = await db.user.findMany({
      where: {
        country: { not: null },
        payments: { some: { status: 'completed' } },
      },
      select: {
        country: true,
        payments: {
          where: { status: 'completed' },
          select: { amount: true },
        },
      },
    });

    const revenueByCountry = new Map<string, number>();
    for (const user of paymentsByCountry) {
      if (user.country) {
        const totalPaid = user.payments.reduce((sum, p) => sum + p.amount, 0);
        revenueByCountry.set(user.country, (revenueByCountry.get(user.country) || 0) + totalPaid);
      }
    }

    const topRevenueCountries = Array.from(revenueByCountry.entries())
      .map(([country, revenue]) => ({
        country,
        revenue: Math.round(revenue * 100) / 100,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return NextResponse.json({
      geography: combined,
      topRevenueCountries,
      summary: {
        totalCountries: combined.length,
        topCountry: combined[0]?.country || 'N/A',
        topCountryUsers: combined[0]?.users || 0,
      },
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json(
        { error: error.message === 'UNAUTHORIZED' ? 'Unauthorized' : 'Forbidden' },
        { status: error.message === 'UNAUTHORIZED' ? 401 : 403 }
      );
    }
    console.error('[Admin Analytics Geography API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
