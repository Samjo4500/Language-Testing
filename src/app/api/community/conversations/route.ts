import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conversations = await db.conversation.findMany({
      where: {
        OR: [{ user1Id: user.userId }, { user2Id: user.userId }],
      },
      include: {
        user1: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
        user2: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    const results = await Promise.all(
      conversations.map(async (conv) => {
        const isUser1 = conv.user1Id === user.userId;
        const partner = isUser1 ? conv.user2 : conv.user1;

        // Count unread messages
        const unreadCount = await db.message.count({
          where: {
            conversationId: conv.id,
            senderId: { not: user.userId },
            isRead: false,
            type: { not: 'system' },
          },
        });

        const lastMessage = conv.messages[0];

        return {
          id: conv.id,
          partner: {
            userId: partner.userId,
            userName: partner.user.name || 'Anonymous',
            nativeLanguage: partner.nativeLanguage,
            targetLanguages: JSON.parse(partner.targetLanguages),
            isOnline: partner.isOnline,
            avatarUrl: partner.user.avatarUrl,
          },
          lastMessage: lastMessage
            ? {
                id: lastMessage.id,
                content: lastMessage.content,
                type: lastMessage.type,
                senderId: lastMessage.senderId,
                createdAt: lastMessage.createdAt,
              }
            : null,
          unreadCount,
          lastMessageAt: conv.lastMessageAt,
          createdAt: conv.createdAt,
        };
      })
    );

    return NextResponse.json({ conversations: results });
  } catch (error) {
    console.error('Get conversations error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
