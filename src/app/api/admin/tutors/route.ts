import { NextRequest, NextResponse } from 'next/server';
import { requireAdminFromRequest, adminErrorResponse } from '@/lib/admin-auth';
import { db } from '@/lib/db';

// GET /api/admin/tutors — List all approved tutors + pending tutor applications
export async function GET(request: NextRequest) {
  try {
    await requireAdminFromRequest(request);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'approved' | 'all'

    const where: any = {};
    if (status === 'approved') {
      where.isApprovedTutor = true;
    }

    const tutors = await db.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        isApprovedTutor: true,
        occupation: true,
        englishLevel: true,
        trustScore: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            hostedLiveRooms: true,
            hostedScheduledEvents: true,
          },
        },
      },
      orderBy: [
        { isApprovedTutor: 'desc' },
        { trustScore: 'desc' },
        { name: 'asc' },
      ],
      take: 100,
    });

    return NextResponse.json({ tutors });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
