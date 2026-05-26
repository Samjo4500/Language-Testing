import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await db.languageProfile.findUnique({
      where: { userId: user.userId },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true, bio: true },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ profile: null });
    }

    return NextResponse.json({
      profile: {
        id: profile.id,
        userId: profile.userId,
        nativeLanguage: profile.nativeLanguage,
        targetLanguages: JSON.parse(profile.targetLanguages),
        proficiencyLevel: profile.proficiencyLevel,
        bio: profile.user.bio,
        timezone: profile.timezone,
        avatarUrl: profile.user.avatarUrl,
        isOnline: profile.isOnline,
        lastSeenAt: profile.lastSeenAt,
        isDiscoverable: profile.isDiscoverable,
        createdAt: profile.createdAt,
        userName: profile.user.name,
        userEmail: profile.user.email,
      },
    });
  } catch (error) {
    console.error('Get language profile error:', error);
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
    const { nativeLanguage, targetLanguages, proficiencyLevel, bio, timezone, isDiscoverable } = body;

    // bio is now on the User model, not LanguageProfile

    if (!nativeLanguage || !targetLanguages || !Array.isArray(targetLanguages)) {
      return NextResponse.json(
        { error: 'nativeLanguage and targetLanguages (array) are required.' },
        { status: 400 }
      );
    }

    if (bio && bio.length > 500) {
      return NextResponse.json(
        { error: 'Bio must be 500 characters or less.' },
        { status: 400 }
      );
    }

    // Update bio on User model if provided
    if (bio !== undefined) {
      await db.user.update({
        where: { id: user.userId },
        data: { bio: bio || null },
      });
    }

    const profile = await db.languageProfile.upsert({
      where: { userId: user.userId },
      update: {
        nativeLanguage,
        targetLanguages: JSON.stringify(targetLanguages),
        proficiencyLevel: proficiencyLevel || 'intermediate',
        timezone: timezone || null,
        isDiscoverable: isDiscoverable !== undefined ? isDiscoverable : true,
        isOnline: true,
        lastSeenAt: new Date(),
      },
      create: {
        userId: user.userId,
        nativeLanguage,
        targetLanguages: JSON.stringify(targetLanguages),
        proficiencyLevel: proficiencyLevel || 'intermediate',
        timezone: timezone || null,
        isDiscoverable: isDiscoverable !== undefined ? isDiscoverable : true,
        isOnline: true,
        lastSeenAt: new Date(),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true, bio: true },
        },
      },
    });

    return NextResponse.json({
      profile: {
        id: profile.id,
        userId: profile.userId,
        nativeLanguage: profile.nativeLanguage,
        targetLanguages: JSON.parse(profile.targetLanguages),
        proficiencyLevel: profile.proficiencyLevel,
        bio: profile.user.bio,
        timezone: profile.timezone,
        avatarUrl: profile.user.avatarUrl,
        isOnline: profile.isOnline,
        lastSeenAt: profile.lastSeenAt,
        isDiscoverable: profile.isDiscoverable,
        createdAt: profile.createdAt,
        userName: profile.user.name,
        userEmail: profile.user.email,
      },
    });
  } catch (error) {
    console.error('Create/update language profile error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
