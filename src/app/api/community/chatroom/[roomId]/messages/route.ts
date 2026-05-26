import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';

// GET: Get messages for a chatroom (paginated, cursor-based)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roomId } = await params;

    // Verify room exists
    const room = await db.chatRoom.findUnique({ where: { id: roomId } });
    if (!room) {
      return NextResponse.json({ error: 'Room not found.' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const after = searchParams.get('after');
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '50'), 1), 100);

    // "after" mode: get messages newer than a timestamp (for polling)
    if (after) {
      const newMessages = await db.chatRoomMessage.findMany({
        where: {
          roomId,
          isDeleted: false,
          createdAt: { gt: new Date(after) },
        },
        orderBy: { createdAt: 'asc' },
        take: limit,
      });

      return NextResponse.json({
        messages: newMessages.map((msg) => ({
          id: msg.id,
          roomId: msg.roomId,
          userId: msg.userId,
          userName: msg.userName,
          userAvatar: msg.userAvatar,
          content: msg.content,
          type: msg.type,
          imageUrl: msg.imageUrl,
          createdAt: msg.createdAt,
        })),
      });
    }

    // "cursor" mode: paginate backwards (older messages)
    const messages = await db.chatRoomMessage.findMany({
      where: {
        roomId,
        isDeleted: false,
        ...(cursor ? { createdAt: { lt: new Date(cursor) } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1, // Take one extra to determine if there's a next page
    });

    const hasMore = messages.length > limit;
    const items = hasMore ? messages.slice(0, limit) : messages;

    // Reverse to show oldest first
    items.reverse();

    return NextResponse.json({
      messages: items.map((msg) => ({
        id: msg.id,
        roomId: msg.roomId,
        userId: msg.userId,
        userName: msg.userName,
        userAvatar: msg.userAvatar,
        content: msg.content,
        type: msg.type,
        imageUrl: msg.imageUrl,
        createdAt: msg.createdAt,
      })),
      hasMore,
      nextCursor: hasMore ? items[0]?.createdAt?.toISOString() : null,
    });
  } catch (error) {
    console.error('Get chatroom messages error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// POST: Send a message to a chatroom
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roomId } = await params;

    // Verify room exists
    const room = await db.chatRoom.findUnique({ where: { id: roomId } });
    if (!room) {
      return NextResponse.json({ error: 'Room not found.' }, { status: 404 });
    }

    const body = await request.json();
    const { content, type, imageUrl } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
    }

    if (content.length > 500) {
      return NextResponse.json({ error: 'Message must be 500 characters or less.' }, { status: 400 });
    }

    // Get user info for denormalized fields
    const user = await db.user.findUnique({
      where: { id: authUser.userId },
      select: { name: true, avatarUrl: true },
    });

    const message = await db.chatRoomMessage.create({
      data: {
        roomId,
        userId: authUser.userId,
        userName: user?.name || authUser.userId,
        userAvatar: user?.avatarUrl || null,
        content: content.trim(),
        type: type || 'text',
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json({
      message: {
        id: message.id,
        roomId: message.roomId,
        userId: message.userId,
        userName: message.userName,
        userAvatar: message.userAvatar,
        content: message.content,
        type: message.type,
        imageUrl: message.imageUrl,
        createdAt: message.createdAt,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Send chatroom message error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
