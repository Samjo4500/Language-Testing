import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';

export async function PUT(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      avatarUrl,
      country,
      phone,
      gender,
      dateOfBirth,
      englishLevel,
      occupation,
      bio,
      interests,
    } = body;

    // Validate gender
    const validGenders = ['male', 'female', 'non-binary', 'prefer-not-to-say'];
    if (gender && !validGenders.includes(gender)) {
      return NextResponse.json({ error: 'Invalid gender value.' }, { status: 400 });
    }

    // Validate englishLevel
    const validLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    if (englishLevel && !validLevels.includes(englishLevel)) {
      return NextResponse.json({ error: 'Invalid English level.' }, { status: 400 });
    }

    // Validate bio length
    if (bio && bio.length > 500) {
      return NextResponse.json({ error: 'Bio must be 500 characters or less.' }, { status: 400 });
    }

    // Validate avatar size (base64 can be large; ~2MB raw ≈ ~2.7MB base64)
    if (avatarUrl && avatarUrl.startsWith('data:') && avatarUrl.length > 3 * 1024 * 1024) {
      return NextResponse.json({ error: 'Avatar image is too large. Maximum size is 2MB.' }, { status: 400 });
    }

    // Build update data
    const updateData: Record<string, unknown> = {};
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl || null;
    if (country !== undefined) updateData.country = country || null;
    if (phone !== undefined) updateData.phone = phone || null;
    if (gender !== undefined) updateData.gender = gender || null;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    if (englishLevel !== undefined) updateData.englishLevel = englishLevel || null;
    if (occupation !== undefined) updateData.occupation = occupation || null;
    if (bio !== undefined) updateData.bio = bio || null;
    if (interests !== undefined) updateData.interests = interests ? JSON.stringify(interests) : null;

    // Mark profile complete since onboarding was finished
    updateData.isProfileComplete = true;

    // Update verification status
    const mergedEmailVerified = true; // Just completed onboarding
    const mergedIsProfileComplete = true;
    if (mergedEmailVerified && mergedIsProfileComplete) {
      updateData.isVerified = true;
    }

    const updatedUser = await db.user.update({
      where: { id: authUser.userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        phone: true,
        gender: true,
        dateOfBirth: true,
        bio: true,
        englishLevel: true,
        occupation: true,
        country: true,
        plan: true,
        role: true,
        accountType: true,
        isProfileComplete: true,
        interests: true,
        isVerified: true,
        emailVerified: true,
        trustScore: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
