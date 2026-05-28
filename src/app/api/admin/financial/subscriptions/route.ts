import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '25', 10)));

    // Get users who have at least one completed payment (i.e., active subscribers)
    const usersWithPayments = await db.user.findMany({
      where: {
        payments: {
          some: { status: 'completed' },
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        planExpiresAt: true,
        createdAt: true,
        payments: {
          where: { status: 'completed' },
          select: {
            id: true,
            amount: true,
            plan: true,
            planType: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await db.user.count({
      where: {
        payments: {
          some: { status: 'completed' },
        },
      },
    });

    const subscriptions = usersWithPayments.map((user) => {
      const latestPayment = user.payments[0];
      const plan = latestPayment?.planType || latestPayment?.plan || user.plan;
      const amount = latestPayment?.amount || 0;
      const startDate = latestPayment?.createdAt?.toISOString() || user.createdAt.toISOString();

      // Derive next billing date (30 days after last payment)
      const nextBilling = latestPayment?.createdAt
        ? new Date(new Date(latestPayment.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : null;

      // Active if planExpiresAt is in the future, or if they have a recent payment
      const isActive = user.planExpiresAt
        ? new Date(user.planExpiresAt) > new Date()
        : true;

      return {
        userId: user.id,
        userEmail: user.email,
        userName: user.name || '',
        plan,
        amount: Math.round(amount * 100) / 100,
        status: isActive ? 'active' : 'expired',
        startDate,
        nextBilling,
      };
    });

    return NextResponse.json({
      subscriptions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json(
        { error: error.message === 'UNAUTHORIZED' ? 'Unauthorized' : 'Forbidden' },
        { status: error.message === 'UNAUTHORIZED' ? 401 : 403 }
      );
    }
    console.error('[Admin Subscriptions API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
