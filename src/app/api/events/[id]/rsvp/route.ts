import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-middleware';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const user = authResult;
    const { id } = await params;

    await db.eventRSVP.upsert({
      where: { eventId_userId: { eventId: id, userId: user.userId } },
      create: { eventId: id, userId: user.userId },
      update: {},
    });

    await db.scheduledEvent.update({ where: { id }, data: { rsvpCount: { increment: 1 } } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to RSVP' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const user = authResult;
    const { id } = await params;

    const rsvp = await db.eventRSVP.findUnique({ where: { eventId_userId: { eventId: id, userId: user.userId } } });
    if (rsvp) {
      await db.eventRSVP.delete({ where: { id: rsvp.id } });
      await db.scheduledEvent.update({ where: { id }, data: { rsvpCount: { decrement: 1 } } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to cancel RSVP' }, { status: 500 });
  }
}
