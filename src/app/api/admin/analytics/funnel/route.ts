import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin();

    // Build a conversion funnel from actual data
    const [
      totalUsers,
      emailVerifiedUsers,
      assessmentStartedUsers,
      assessmentCompletedUsers,
      paidUsers,
      certificateUsers,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { emailVerified: true } }),
      db.user.count({
        where: { assessments: { some: { status: { in: ['in_progress', 'completed'] } } } },
      }),
      db.user.count({
        where: { assessments: { some: { status: 'completed' } } },
      }),
      db.user.count({
        where: { payments: { some: { status: 'completed' } } },
      }),
      db.user.count({
        where: { certificates: { some: {} } },
      }),
    ]);

    const funnel = [
      { stage: 'Registration', count: totalUsers, rate: 100 },
      {
        stage: 'Email Verified',
        count: emailVerifiedUsers,
        rate: totalUsers > 0 ? Math.round((emailVerifiedUsers / totalUsers) * 100) : 0,
      },
      {
        stage: 'Started Assessment',
        count: assessmentStartedUsers,
        rate: totalUsers > 0 ? Math.round((assessmentStartedUsers / totalUsers) * 100) : 0,
      },
      {
        stage: 'Completed Assessment',
        count: assessmentCompletedUsers,
        rate: totalUsers > 0 ? Math.round((assessmentCompletedUsers / totalUsers) * 100) : 0,
      },
      {
        stage: 'Made Payment',
        count: paidUsers,
        rate: totalUsers > 0 ? Math.round((paidUsers / totalUsers) * 100) : 0,
      },
      {
        stage: 'Earned Certificate',
        count: certificateUsers,
        rate: totalUsers > 0 ? Math.round((certificateUsers / totalUsers) * 100) : 0,
      },
    ];

    // Calculate drop-off between stages
    const dropoffs: Array<{ from: string; to: string; dropped: number; dropoffRate: number }> = [];
    for (let i = 1; i < funnel.length; i++) {
      const prev = funnel[i - 1];
      const curr = funnel[i];
      const dropoff = prev.count > 0
        ? Math.round(((prev.count - curr.count) / prev.count) * 100)
        : 0;
      dropoffs.push({
        from: prev.stage,
        to: curr.stage,
        dropped: prev.count - curr.count,
        dropoffRate: dropoff,
      });
    }

    return NextResponse.json({
      funnel,
      dropoffs,
      overallConversion: {
        fromRegistration: totalUsers,
        toPayment: paidUsers,
        conversionRate: totalUsers > 0 ? Math.round((paidUsers / totalUsers) * 10000) / 100 : 0,
      },
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json(
        { error: error.message === 'UNAUTHORIZED' ? 'Unauthorized' : 'Forbidden' },
        { status: error.message === 'UNAUTHORIZED' ? 401 : 403 }
      );
    }
    console.error('[Admin Analytics Funnel API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
