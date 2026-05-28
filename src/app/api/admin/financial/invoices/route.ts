import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '25', 10)));
    const status = searchParams.get('status') || undefined;

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    const [payments, total] = await Promise.all([
      db.payment.findMany({
        where,
        select: {
          id: true,
          userId: true,
          amount: true,
          currency: true,
          plan: true,
          planType: true,
          status: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.payment.count({ where }),
    ]);

    const invoices = payments.map((p) => ({
      id: p.id,
      userId: p.userId,
      userEmail: p.user.email,
      userName: p.user.name || '',
      amount: p.amount,
      currency: p.currency,
      plan: p.planType || p.plan,
      status: p.status,
      date: p.createdAt.toISOString(),
    }));

    return NextResponse.json({
      invoices,
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
    console.error('[Admin Invoices API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
