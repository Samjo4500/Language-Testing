import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';

// POST: Toggle like on a moment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ momentId: string }> }
) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { momentId } = await params;

    const moment = await db.moment.findUnique({
      where: { id: momentId },
      select: { id: true, isDeleted: true },
    });

    if (!moment || moment.isDeleted) {
      return NextResponse.json({ error: 'Moment not found.' }, { status: 404 });
    }

    // Check if already liked
    const existingLike = await db.momentLike.findUnique({
      where: {
        momentId_userId: {
          momentId,
          userId: user.userId,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await db.momentLike.delete({ where: { id: existingLike.id } });
      const updated = await db.moment.update({
        where: { id: momentId },
        data: { likesCount: { decrement: 1 } },
        select: { likesCount: true },
      });
      return NextResponse.json({ liked: false, likesCount: updated.likesCount });
    } else {
      // Like
      await db.momentLike.create({
        data: { momentId, userId: user.userId },
      });
      const updated = await db.moment.update({
        where: { id: momentId },
        data: { likesCount: { increment: 1 } },
        select: { likesCount: true },
      });
      return NextResponse.json({ liked: true, likesCount: updated.likesCount });
    }
  } catch (error) {
    console.error('Toggle like error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
