import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';
import { adminLimiter } from '@/lib/rate-limit';

/**
 * GET /api/admin/payments
 * List payments with revenue KPIs and pagination.
 * Query params: page, limit, status
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

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const status = searchParams.get('status')?.trim() || undefined;

    const validStatuses = ['pending', 'completed', 'failed', 'refunded'];

    const where: Record<string, unknown> = {};
    if (status && validStatuses.includes(status)) {
      where.status = status;
    }

    const [payments, total, revenueKpis] = await Promise.all([
      db.payment.findMany({
        where,
        select: {
          id: true,
          userId: true,
          paypalOrderId: true,
          paypalCaptureId: true,
          amount: true,
          currency: true,
          status: true,
          plan: true,
          createdAt: true,
          updatedAt: true,
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
      // Revenue KPIs (always computed across completed payments regardless of filter)
      db.payment.aggregate({
        _sum: { amount: true },
        _count: true,
        where: { status: 'completed' },
      }),
    ]);

    return NextResponse.json({
      payments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      revenueKpis: {
        totalRevenue: revenueKpis._sum.amount ?? 0,
        completedPayments: revenueKpis._count,
      },
    });
  } catch (error) {
    console.error('List payments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments.' },
      { status: 500 }
    );
  }
}
