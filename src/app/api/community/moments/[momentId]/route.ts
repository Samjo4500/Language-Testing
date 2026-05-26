import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';

// DELETE: Delete a moment (only by author)
export async function DELETE(
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
      select: { userId: true, isDeleted: true },
    });

    if (!moment || moment.isDeleted) {
      return NextResponse.json({ error: 'Moment not found.' }, { status: 404 });
    }

    if (moment.userId !== user.userId) {
      return NextResponse.json({ error: 'You can only delete your own moments.' }, { status: 403 });
    }

    await db.moment.update({
      where: { id: momentId },
      data: { isDeleted: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete moment error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
