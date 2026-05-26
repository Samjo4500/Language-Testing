import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: authUser.userId },
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

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const languageProfile = await db.languageProfile.findUnique({
      where: { userId: authUser.userId },
      select: {
        id: true,
        nativeLanguage: true,
        targetLanguages: true,
        proficiencyLevel: true,
        timezone: true,
        isOnline: true,
        isDiscoverable: true,
      },
    });

    return NextResponse.json({
      user,
      languageProfile: languageProfile
        ? {
            ...languageProfile,
            targetLanguages: JSON.parse(languageProfile.targetLanguages),
          }
        : null,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      avatarUrl,
      phone,
      gender,
      dateOfBirth,
      bio,
      englishLevel,
      occupation,
      country,
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
    if (name !== undefined) updateData.name = name || null;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl || null;
    if (phone !== undefined) updateData.phone = phone || null;
    if (gender !== undefined) updateData.gender = gender || null;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    if (bio !== undefined) updateData.bio = bio || null;
    if (englishLevel !== undefined) updateData.englishLevel = englishLevel || null;
    if (occupation !== undefined) updateData.occupation = occupation || null;
    if (country !== undefined) updateData.country = country || null;
    if (interests !== undefined) updateData.interests = interests ? JSON.stringify(interests) : null;

    // Check if profile is now complete
    const currentUser = await db.user.findUnique({
      where: { id: authUser.userId },
    });

    if (currentUser) {
      const mergedName = updateData.name !== undefined ? updateData.name : currentUser.name;
      const mergedCountry = updateData.country !== undefined ? updateData.country : currentUser.country;
      const mergedEnglishLevel = updateData.englishLevel !== undefined ? updateData.englishLevel : currentUser.englishLevel;

      // Profile is considered complete if name, country, and englishLevel are set
      if (mergedName && mergedCountry && mergedEnglishLevel) {
        updateData.isProfileComplete = true;
      }

      // Update verification status
      const mergedEmailVerified = currentUser.emailVerified;
      const mergedIsProfileComplete = mergedName && mergedCountry && mergedEnglishLevel;
      if (mergedEmailVerified && mergedIsProfileComplete) {
        updateData.isVerified = true;
      }
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

    const languageProfile = await db.languageProfile.findUnique({
      where: { userId: authUser.userId },
      select: {
        id: true,
        nativeLanguage: true,
        targetLanguages: true,
        proficiencyLevel: true,
        timezone: true,
        isOnline: true,
        isDiscoverable: true,
      },
    });

    return NextResponse.json({
      user: updatedUser,
      languageProfile: languageProfile
        ? {
            ...languageProfile,
            targetLanguages: JSON.parse(languageProfile.targetLanguages),
          }
        : null,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
