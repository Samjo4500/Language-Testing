import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: conversationId } = await params;

    // Verify the user is part of this conversation
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
    }

    if (conversation.user1Id !== user.userId && conversation.user2Id !== user.userId) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      db.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.message.count({ where: { conversationId } }),
    ]);

    // Mark unread messages as read
    await db.message.updateMany({
      where: {
        conversationId,
        senderId: { not: user.userId },
        isRead: false,
      },
      data: { isRead: true },
    });

    // Get partner info
    const isUser1 = conversation.user1Id === user.userId;
    const partnerId = isUser1 ? conversation.user2Id : conversation.user1Id;
    const partnerProfile = await db.languageProfile.findUnique({
      where: { userId: partnerId },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    return NextResponse.json({
      messages: messages.reverse(), // Return in chronological order
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      partner: partnerProfile
        ? {
            userId: partnerProfile.userId,
            userName: partnerProfile.user.name || 'Anonymous',
            nativeLanguage: partnerProfile.nativeLanguage,
            targetLanguages: JSON.parse(partnerProfile.targetLanguages),
            isOnline: partnerProfile.isOnline,
            avatarUrl: partnerProfile.user.avatarUrl,
          }
        : null,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: conversationId } = await params;

    // Verify the user is part of this conversation
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
    }

    if (conversation.user1Id !== user.userId && conversation.user2Id !== user.userId) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    const body = await request.json();
    const { content, type, correctionOriginal, correctionExplanation } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
    }

    const messageType = type || 'text';
    if (!['text', 'correction'].includes(messageType)) {
      return NextResponse.json({ error: 'Type must be "text" or "correction".' }, { status: 400 });
    }

    const message = await db.message.create({
      data: {
        conversationId,
        senderId: user.userId,
        content: content.trim(),
        type: messageType,
        correctionOriginal: messageType === 'correction' ? correctionOriginal : null,
        correctionExplanation: messageType === 'correction' ? correctionExplanation : null,
      },
    });

    // Update conversation's lastMessageAt
    await db.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
