import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure user has a language profile
    const profile = await db.languageProfile.findUnique({
      where: { userId: user.userId },
    });
    if (!profile) {
      return NextResponse.json({ sent: [], received: [] });
    }

    const [sent, received] = await Promise.all([
      db.partnerRequest.findMany({
        where: { fromUserId: user.userId },
        include: {
          toUser: {
            include: {
              user: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      db.partnerRequest.findMany({
        where: { toUserId: user.userId },
        include: {
          fromUser: {
            include: {
              user: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const formatRequest = (r: typeof sent[0] | typeof received[0], direction: 'sent' | 'received') => ({
      id: r.id,
      message: r.message,
      status: r.status,
      createdAt: r.createdAt,
      partner: direction === 'sent'
        ? {
            userId: (r as typeof sent[0]).toUser.userId,
            userName: (r as typeof sent[0]).toUser.user.name || 'Anonymous',
            nativeLanguage: (r as typeof sent[0]).toUser.nativeLanguage,
            targetLanguages: JSON.parse((r as typeof sent[0]).toUser.targetLanguages),
            isOnline: (r as typeof sent[0]).toUser.isOnline,
          }
        : {
            userId: (r as typeof received[0]).fromUser.userId,
            userName: (r as typeof received[0]).fromUser.user.name || 'Anonymous',
            nativeLanguage: (r as typeof received[0]).fromUser.nativeLanguage,
            targetLanguages: JSON.parse((r as typeof received[0]).fromUser.targetLanguages),
            isOnline: (r as typeof received[0]).fromUser.isOnline,
          },
    });

    return NextResponse.json({
      sent: sent.map((r) => formatRequest(r, 'sent')),
      received: received.map((r) => formatRequest(r, 'received')),
    });
  } catch (error) {
    console.error('Get partner requests error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { toUserId, message } = body;

    if (!toUserId) {
      return NextResponse.json({ error: 'toUserId is required.' }, { status: 400 });
    }

    if (toUserId === user.userId) {
      return NextResponse.json({ error: 'Cannot send request to yourself.' }, { status: 400 });
    }

    // Ensure both users have language profiles
    const [fromProfile, toProfile] = await Promise.all([
      db.languageProfile.findUnique({ where: { userId: user.userId } }),
      db.languageProfile.findUnique({ where: { userId: toUserId } }),
    ]);

    if (!fromProfile) {
      return NextResponse.json({ error: 'You need to create a language profile first.' }, { status: 400 });
    }

    if (!toProfile) {
      return NextResponse.json({ error: 'Target user does not have a language profile.' }, { status: 404 });
    }

    // Check if a request already exists (any direction)
    const existingRequest = await db.partnerRequest.findFirst({
      where: {
        OR: [
          { fromUserId: user.userId, toUserId },
          { fromUserId: toUserId, toUserId: user.userId },
        ],
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: 'A request already exists between you and this user.' },
        { status: 409 }
      );
    }

    // Check if already connected
    const existingConversation = await db.conversation.findFirst({
      where: {
        OR: [
          { user1Id: user.userId, user2Id: toUserId },
          { user1Id: toUserId, user2Id: user.userId },
        ],
      },
    });

    if (existingConversation) {
      return NextResponse.json(
        { error: 'You are already connected with this user.' },
        { status: 409 }
      );
    }

    const partnerRequest = await db.partnerRequest.create({
      data: {
        fromUserId: user.userId,
        toUserId,
        message: message || null,
      },
    });

    return NextResponse.json({ request: partnerRequest }, { status: 201 });
  } catch (error) {
    console.error('Send partner request error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { requestId, action } = body;

    if (!requestId || !action) {
      return NextResponse.json({ error: 'requestId and action are required.' }, { status: 400 });
    }

    if (!['accept', 'decline'].includes(action)) {
      return NextResponse.json({ error: 'Action must be "accept" or "decline".' }, { status: 400 });
    }

    const partnerRequest = await db.partnerRequest.findUnique({
      where: { id: requestId },
    });

    if (!partnerRequest) {
      return NextResponse.json({ error: 'Request not found.' }, { status: 404 });
    }

    if (partnerRequest.toUserId !== user.userId) {
      return NextResponse.json({ error: 'You can only respond to requests sent to you.' }, { status: 403 });
    }

    if (partnerRequest.status !== 'pending') {
      return NextResponse.json({ error: 'Request is no longer pending.' }, { status: 400 });
    }

    if (action === 'decline') {
      const updated = await db.partnerRequest.update({
        where: { id: requestId },
        data: { status: 'declined' },
      });
      return NextResponse.json({ request: updated });
    }

    // Accept: update request and create conversation
    const [updated, conversation] = await db.$transaction([
      db.partnerRequest.update({
        where: { id: requestId },
        data: { status: 'accepted' },
      }),
      db.conversation.create({
        data: {
          user1Id: partnerRequest.fromUserId,
          user2Id: partnerRequest.toUserId,
        },
      }),
    ]);

    // Create a system message in the conversation
    await db.message.create({
      data: {
        conversationId: conversation.id,
        senderId: 'system',
        content: 'You are now connected! Start chatting and help each other learn.',
        type: 'system',
      },
    });

    return NextResponse.json({ request: updated, conversationId: conversation.id });
  } catch (error) {
    console.error('Handle partner request error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
