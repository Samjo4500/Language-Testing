import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const nativeLang = searchParams.get('nativeLang');
    const targetLang = searchParams.get('targetLang');
    const country = searchParams.get('country');
    const gender = searchParams.get('gender');
    const onlineOnly = searchParams.get('onlineOnly') === 'true';
    const proficiencyLevel = searchParams.get('proficiencyLevel');
    const interests = searchParams.get('interests');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const skip = (page - 1) * limit;

    // Get current user's conversations to exclude already connected partners
    const conversations = await db.conversation.findMany({
      where: {
        OR: [{ user1Id: user.userId }, { user2Id: user.userId }],
      },
      select: { user1Id: true, user2Id: true },
    });

    const connectedUserIds = new Set<string>();
    conversations.forEach((c) => {
      connectedUserIds.add(c.user1Id);
      connectedUserIds.add(c.user2Id);
    });
    connectedUserIds.add(user.userId); // exclude self

    // Get pending requests to exclude
    const pendingRequests = await db.partnerRequest.findMany({
      where: {
        OR: [
          { fromUserId: user.userId, status: 'pending' },
          { toUserId: user.userId, status: 'pending' },
        ],
      },
      select: { fromUserId: true, toUserId: true },
    });

    const requestedUserIds = new Set<string>();
    pendingRequests.forEach((r) => {
      requestedUserIds.add(r.fromUserId);
      requestedUserIds.add(r.toUserId);
    });

    const where: Record<string, unknown> = {
      isDiscoverable: true,
      userId: { notIn: [...connectedUserIds] },
    };

    if (nativeLang) {
      where.nativeLanguage = nativeLang;
    }

    if (targetLang) {
      where.targetLanguages = { contains: `"${targetLang}"` };
    }

    if (onlineOnly) {
      where.isOnline = true;
    }

    if (proficiencyLevel) {
      where.proficiencyLevel = proficiencyLevel;
    }

    // Build user filter for country, gender, interests
    const userFilter: Record<string, unknown> = {};

    if (country) {
      userFilter.country = country;
    }

    if (gender && gender !== 'any') {
      userFilter.gender = gender;
    }

    if (interests) {
      const interestList = interests.split(',').map((i) => i.trim()).filter(Boolean);
      if (interestList.length > 0) {
        userFilter.OR = interestList.map((interest) => ({
          interests: { contains: `"${interest}"` },
        }));
      }
    }

    if (Object.keys(userFilter).length > 0) {
      where.user = userFilter;
    }

    const [profiles, total] = await Promise.all([
      db.languageProfile.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, bio: true, country: true, gender: true, interests: true, isVerified: true, emailVerified: true, isProfileComplete: true },
          },
        },
        orderBy: [{ isOnline: 'desc' }, { lastSeenAt: 'desc' }],
        skip,
        take: limit,
      }),
      db.languageProfile.count({ where }),
    ]);

    const results = profiles.map((p) => ({
      id: p.id,
      userId: p.userId,
      userName: p.user.name || 'Anonymous',
      nativeLanguage: p.nativeLanguage,
      targetLanguages: JSON.parse(p.targetLanguages),
      proficiencyLevel: p.proficiencyLevel,
      bio: p.user.bio,
      isOnline: p.isOnline,
      lastSeenAt: p.lastSeenAt,
      country: p.user.country,
      gender: p.user.gender,
      interests: p.user.interests ? JSON.parse(p.user.interests) : [],
      isVerified: p.user.isVerified,
      emailVerified: p.user.emailVerified,
      isProfileComplete: p.user.isProfileComplete,
      hasPendingRequest: requestedUserIds.has(p.userId),
    }));

    return NextResponse.json({
      partners: results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Discover partners error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
