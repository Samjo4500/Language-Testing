import { NextRequest, NextResponse } from 'next/server';
import { requireAdminFromRequest, adminErrorResponse } from '@/lib/admin-auth';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminFromRequest(request);

    const { id } = await params;

    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        plan: true,
        status: true,
        isSuspended: true,
        accountType: true,
        emailVerified: true,
        englishLevel: true,
        country: true,
        avatarUrl: true,
        bio: true,
        occupation: true,
        trustScore: true,
        isDemo: true,
        testCredits: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            assessments: true,
            certificates: true,
            payments: true,
            supportTickets: true,
            reports: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get recent assessments
    const recentAssessments = await db.assessment.findMany({
      where: { userId: id },
      select: {
        id: true,
        status: true,
        cefrLevel: true,
        score: true,
        completedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Get payment history
    const payments = await db.payment.findMany({
      where: { userId: id },
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        plan: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({
      user,
      recentAssessments,
      payments,
    });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
