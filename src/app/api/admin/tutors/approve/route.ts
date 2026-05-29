import { NextRequest, NextResponse } from 'next/server';
import { requireAdminFromRequest, adminErrorResponse } from '@/lib/admin-auth';
import { db } from '@/lib/db';

// POST /api/admin/tutors/approve — Approve or revoke tutor status
// Body: { userId: string, approved: boolean }
export async function POST(request: NextRequest) {
  try {
    await requireAdminFromRequest(request);

    const body = await request.json();
    const { userId, approved } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    if (typeof approved !== 'boolean') {
      return NextResponse.json({ error: 'approved (boolean) is required' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role === 'admin' && !approved) {
      // Admins are implicitly allowed to create rooms, but we can still toggle the tutor badge
    }

    await db.user.update({
      where: { id: userId },
      data: {
        isApprovedTutor: approved,
        // Increment tokenVersion so the change takes effect immediately
        tokenVersion: { increment: 1 },
      },
    });

    return NextResponse.json({
      message: approved
        ? `${user.name || user.email} has been approved as a tutor. They can now create live rooms.`
        : `Tutor status revoked for ${user.name || user.email}. They can no longer create live rooms.`,
      userId,
      isApprovedTutor: approved,
    });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
