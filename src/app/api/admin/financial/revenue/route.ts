import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin();

    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'daily'; // daily | weekly | monthly

    // Compute date boundaries
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fetch all completed payments for calculations
    const completedPayments = await db.payment.findMany({
      where: { status: 'completed' },
      select: {
        id: true,
        amount: true,
        currency: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Total revenue
    const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);

    // This month revenue
    const thisMonthRevenue = completedPayments
      .filter(p => p.createdAt >= monthStart)
      .reduce((sum, p) => sum + p.amount, 0);

    // This week revenue
    const thisWeekRevenue = completedPayments
      .filter(p => p.createdAt >= weekStart)
      .reduce((sum, p) => sum + p.amount, 0);

    // Today revenue
    const todayRevenue = completedPayments
      .filter(p => p.createdAt >= todayStart)
      .reduce((sum, p) => sum + p.amount, 0);

    // Group revenue by period
    const revenueMap = new Map<string, { amount: number; count: number }>();

    for (const payment of completedPayments) {
      let dateKey: string;
      const d = payment.createdAt;

      if (period === 'daily') {
        dateKey = d.toISOString().slice(0, 10); // "2025-01-15"
      } else if (period === 'weekly') {
        const weekDate = new Date(d);
        weekDate.setDate(weekDate.getDate() - weekDate.getDay());
        dateKey = weekDate.toISOString().slice(0, 10);
      } else {
        dateKey = d.toISOString().slice(0, 7); // "2025-01"
      }

      const existing = revenueMap.get(dateKey) || { amount: 0, count: 0 };
      existing.amount += payment.amount;
      existing.count += 1;
      revenueMap.set(dateKey, existing);
    }

    // Convert to sorted array
    const revenue = Array.from(revenueMap.entries())
      .map(([date, data]) => ({
        date,
        amount: Math.round(data.amount * 100) / 100,
        count: data.count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // MRR = this month's revenue; ARR = MRR * 12
    const mrr = thisMonthRevenue;
    const arr = mrr * 12;

    return NextResponse.json({
      revenue,
      kpis: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        thisMonth: Math.round(thisMonthRevenue * 100) / 100,
        thisWeek: Math.round(thisWeekRevenue * 100) / 100,
        today: Math.round(todayRevenue * 100) / 100,
        mrr: Math.round(mrr * 100) / 100,
        arr: Math.round(arr * 100) / 100,
      },
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json(
        { error: error.message === 'UNAUTHORIZED' ? 'Unauthorized' : 'Forbidden' },
        { status: error.message === 'UNAUTHORIZED' ? 401 : 403 }
      );
    }
    console.error('[Admin Revenue API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
