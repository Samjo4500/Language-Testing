import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-middleware';

// GET /api/events
export async function GET(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const upcoming = searchParams.get('upcoming') === 'true';

    const where: any = {};
    if (type && type !== 'all') where.type = type;
    if (upcoming) where.scheduledFor = { gte: new Date() };

    const events = await db.scheduledEvent.findMany({
      where,
      include: { host: { select: { id: true, name: true, avatarUrl: true } }, rsvps: true },
      orderBy: { scheduledFor: 'asc' },
      take: 30,
    });

    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST /api/events
export async function POST(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const user = authResult;

    const body = await request.json();
    const { title, description, type = 'LIVE_CLASS', cefrLevel, topic, scheduledFor, duration = 60, maxParticipants = 50, isRecurring = false, recurrenceRule } = body;

    if (!title?.trim() || !scheduledFor) {
      return NextResponse.json({ error: 'Title and schedule time required' }, { status: 400 });
    }

    const dbUser = await db.user.findUnique({ where: { id: user.userId }, select: { name: true, avatarUrl: true } });

    const event = await db.scheduledEvent.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        type,
        hostId: user.userId,
        hostName: dbUser?.name || 'Anonymous',
        hostAvatar: dbUser?.avatarUrl || null,
        cefrLevel: cefrLevel || null,
        topic: topic || null,
        scheduledFor: new Date(scheduledFor),
        duration,
        maxParticipants,
        isRecurring,
        recurrenceRule: recurrenceRule || null,
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
