import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';

/**
 * GET /api/admin/emails
 * Returns email-related data: users with email verification status,
 * password reset requests, and email configuration.
 */
export async function GET(request: NextRequest) {
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
    const filter = searchParams.get('filter') || 'all'; // all, verified, unverified

    const where = filter === 'verified'
      ? { emailVerified: true }
      : filter === 'unverified'
        ? { emailVerified: false }
        : {};

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          emailVerified: true,
          plan: true,
          role: true,
          createdAt: true,
          payments: {
            select: { id: true, amount: true, status: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          assessments: {
            select: { id: true, cefrLevel: true, status: true, completedAt: true },
            orderBy: { createdAt: 'desc' },
            take: 3,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.user.count({ where }),
    ]);

    // Email stats
    const [totalUsers, verifiedUsers, unverifiedUsers, premiumUsers] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { emailVerified: true } }),
      db.user.count({ where: { emailVerified: false } }),
      db.user.count({ where: { plan: { in: ['premium', 'pro'] } } }),
    ]);

    // Check email service configuration
    const emailConfig = {
      resendKeySet: !!process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.length > 0,
      appUrlSet: !!process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL.length > 0,
      appUrl: process.env.NEXT_PUBLIC_APP_URL || '(not set)',
    };

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        totalUsers,
        verifiedUsers,
        unverifiedUsers,
        premiumUsers,
        verificationRate: totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0,
      },
      emailConfig,
    });
  } catch (error) {
    console.error('Admin emails error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email data.' },
      { status: 500 }
    );
  }
}
