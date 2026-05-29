import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';

// POST /api/community/auto-seed
// Automatically seeds community profiles if the platform has fewer than 10 profiles.
// Once 10+ profiles exist, requires admin auth to re-seed.
export async function POST(request: NextRequest) {
  // Block in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Seed endpoints disabled in production' }, { status: 403 });
  }

  try {
    const existingCount = await db.languageProfile.count();

    if (existingCount >= 10) {
      // Require admin auth for re-seeding
      const authUser = getAuthUser(request);
      if (!authUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const adminError = requireAdmin(authUser);
      if (adminError) return adminError;

      return NextResponse.json({
        seeded: false,
        message: `Community already has ${existingCount} profiles. No seeding needed.`,
        count: existingCount,
      });
    }

    // Seed 50 community profiles
    const passwordHash = await hashPassword('Community123!');

    const names = ['Sofia', 'Lucas', 'Emma', 'Kenji', 'Aisha', 'Omar', 'Maria', 'Hugo', 'Yuki', 'Min-jae',
      'Wei', 'Chen', 'Isabella', 'Mateo', 'Priya', 'Raj', 'Elena', 'Ivan', 'Fatima', 'Ali',
      'Camila', 'Juan', 'Mei', 'Pablo', 'Nadia', 'Lars', 'Lina', 'Niko', 'Amira', 'Samir',
      'Aria', 'Kai', 'Mia', 'Noah', 'Zara', 'Aiden', 'Leila', 'Ravi', 'Chiara', 'Takeshi',
      'Ana', 'Alex', 'Laura', 'David', 'Sana', 'Ryan', 'Yuna', 'Jun', 'Hana', 'Leo'];

    const countries = ['Brazil', 'Japan', 'France', 'Germany', 'Egypt', 'Saudi Arabia', 'Spain', 'Mexico',
      'South Korea', 'China', 'India', 'Turkey', 'Italy', 'Colombia', 'Nigeria', 'Russia',
      'Morocco', 'Poland', 'Argentina', 'Vietnam', 'Indonesia', 'Sweden', 'Netherlands',
      'Norway', 'Greece', 'Portugal', 'Thailand', 'Philippines', 'South Africa', 'Ukraine'];

    const langMap: Record<string, string> = {
      'Brazil': 'pt', 'Japan': 'ja', 'France': 'fr', 'Germany': 'de', 'Egypt': 'ar',
      'Saudi Arabia': 'ar', 'Spain': 'es', 'Mexico': 'es', 'South Korea': 'ko', 'China': 'zh',
      'India': 'hi', 'Turkey': 'tr', 'Italy': 'it', 'Colombia': 'es', 'Nigeria': 'en',
      'Russia': 'ru', 'Morocco': 'ar', 'Poland': 'pl', 'Argentina': 'es', 'Vietnam': 'vi',
      'Indonesia': 'id', 'Sweden': 'sv', 'Netherlands': 'nl', 'Norway': 'no', 'Greece': 'el',
      'Portugal': 'pt', 'Thailand': 'th', 'Philippines': 'tl', 'South Africa': 'en', 'Ukraine': 'uk',
    };

    const timezones = ['America/Sao_Paulo', 'Asia/Tokyo', 'Europe/Paris', 'Europe/Berlin', 'Africa/Cairo',
      'Asia/Riyadh', 'Europe/Madrid', 'America/Mexico_City', 'Asia/Seoul', 'Asia/Shanghai',
      'Asia/Kolkata', 'Europe/Istanbul', 'Europe/Rome', 'America/Bogota', 'Africa/Lagos',
      'Europe/Moscow', 'Africa/Casablanca', 'Europe/Warsaw', 'America/Buenos_Aires', 'Asia/Ho_Chi_Minh',
      'Asia/Jakarta', 'Europe/Stockholm', 'Europe/Amsterdam', 'Europe/Oslo', 'Europe/Athens',
      'Europe/Lisbon', 'Asia/Bangkok', 'Asia/Manila', 'Africa/Johannesburg', 'Europe/Kyiv'];

    const bios = [
      "I'm learning English to travel the world and meet new people!",
      'Studying English for my career in international business.',
      'English opens so many doors! I want to attend international conferences.',
      "I'm a language enthusiast. English is my third language!",
      'Living in a multicultural city, English is essential for daily communication.',
      "I started learning English last year and I'm already at B1 level!",
      'My dream is to study abroad in an English-speaking country.',
      'I love English literature and want to read classic novels in their original language.',
      'Working in IT, English is crucial for documentation and team communication.',
      'English helps me connect with people from all over the world.',
    ];

    const cefrLevels = ['A2', 'B1', 'B1', 'B2', 'B2', 'C1', 'A2', 'B1', 'B2', 'C1'];
    const avatarColors = ['3b82f6', 'ef4444', '10b981', 'f59e0b', '8b5cf6', 'ec4899', '06b6d4', 'f97316'];

    let usersCreated = 0;
    let profilesCreated = 0;

    for (let i = 0; i < 50; i++) {
      const name = names[i % names.length];
      const surname = countries[i % countries.length];
      const fullName = `${name} ${surname}`;
      const email = `community.${name.toLowerCase().replace(/[^a-z0-9]/g, '')}${i}@testcefr.com`;
      const country = countries[i % countries.length];
      const nativeLanguage = langMap[country] || 'en';
      const timezone = timezones[i % timezones.length];

      const existing = await db.user.findUnique({ where: { email } });
      if (existing) continue;

      const cefrLevel = cefrLevels[i % cefrLevels.length];
      const isOnline = Math.random() < 0.3;
      const bio = bios[i % bios.length];
      const avatarColor = avatarColors[i % avatarColors.length];
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=${avatarColor}&color=fff&size=128`;

      const user = await db.user.create({
        data: {
          email,
          name: fullName,
          passwordHash,
          country,
          avatarUrl,
          bio,
          englishLevel: cefrLevel,
          isDemo: true,
          isProfileComplete: true,
          emailVerified: true,
          isVerified: Math.random() < 0.4,
          trustScore: Math.floor(Math.random() * 60) + 10,
          interests: JSON.stringify(['Travel', 'Technology', 'Music', 'Reading', 'Sports'].sort(() => Math.random() - 0.5).slice(0, 3)),
          plan: Math.random() < 0.15 ? 'premium' : 'free',
          role: 'user',
          gender: i % 2 === 0 ? 'female' : 'male',
          occupation: ['Student', 'Engineer', 'Teacher', 'Designer', 'Doctor'][i % 5],
        },
      });

      usersCreated++;

      await db.languageProfile.create({
        data: {
          userId: user.id,
          nativeLanguage,
          targetLanguages: JSON.stringify(['en']),
          proficiencyLevel: ['beginner', 'intermediate', 'advanced'][i % 3],
          timezone,
          isDiscoverable: Math.random() < 0.85,
          isOnline,
          lastSeenAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
        },
      });

      profilesCreated++;
    }

    return NextResponse.json({
      seeded: true,
      message: `Auto-seeded ${usersCreated} users and ${profilesCreated} profiles.`,
      usersCreated,
      profilesCreated,
    });
  } catch (error) {
    console.error('Auto-seed error:', error);
    return NextResponse.json(
      { seeded: false, error: 'Auto-seed failed' },
      { status: 500 }
    );
  }
}
