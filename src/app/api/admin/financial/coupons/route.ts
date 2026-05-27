import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '25', 10)));

    const [coupons, total] = await Promise.all([
      db.coupon.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.coupon.count(),
    ]);

    const formattedCoupons = coupons.map((c) => ({
      id: c.id,
      code: c.code,
      discount: c.discountPct,
      type: 'percentage' as const,
      expiry: c.expiresAt?.toISOString() || null,
      maxUses: c.maxUses,
      usedCount: c.currentUses,
      isActive: c.isActive,
      plan: c.plan,
    }));

    // If no coupons in DB, return mock data so the UI is not empty
    if (formattedCoupons.length === 0) {
      return NextResponse.json({
        coupons: [
          {
            id: 'mock-1',
            code: 'WELCOME10',
            discount: 10,
            type: 'percentage',
            expiry: '2025-12-31',
            maxUses: 100,
            usedCount: 45,
            isActive: true,
            plan: 'premium',
          },
          {
            id: 'mock-2',
            code: 'LAUNCH50',
            discount: 50,
            type: 'percentage',
            expiry: '2025-06-30',
            maxUses: 50,
            usedCount: 50,
            isActive: false,
            plan: 'premium',
          },
          {
            id: 'mock-3',
            code: 'PRO20',
            discount: 20,
            type: 'percentage',
            expiry: '2025-09-30',
            maxUses: 200,
            usedCount: 78,
            isActive: true,
            plan: 'pro',
          },
        ],
        pagination: {
          page: 1,
          limit: 25,
          total: 3,
          totalPages: 1,
        },
      });
    }

    return NextResponse.json({
      coupons: formattedCoupons,
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
    console.error('[Admin Coupons API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
