import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';
import { hashPassword } from '@/lib/auth';

// ─── Profile Data ─────────────────────────────────────────

const COUNTRIES = [
  'Brazil', 'Mexico', 'Spain', 'France', 'Germany', 'Italy', 'Japan', 'South Korea',
  'China', 'India', 'Turkey', 'Saudi Arabia', 'Egypt', 'Nigeria', 'South Africa',
  'Russia', 'Poland', 'Ukraine', 'Colombia', 'Argentina', 'Vietnam', 'Thailand',
  'Indonesia', 'Philippines', 'Portugal', 'Netherlands', 'Sweden', 'Norway', 'Greece', 'Morocco',
];

const FEMALE_NAMES = [
  'Sofia', 'Maria', 'Emma', 'Yuki', 'Ji-eun', 'Wei', 'Aisha', 'Fatima', 'Anastasia', 'Isabella',
  'Camila', 'Priya', 'Mei', 'Elena', 'Nadia', 'Lina', 'Amira', 'Klara', 'Ingrid', 'Eva',
  'Aria', 'Mia', 'Zara', 'Leila', 'Chiara', 'Ana', 'Laura', 'Sana', 'Yuna', 'Hana',
];

const MALE_NAMES = [
  'Lucas', 'Hugo', 'Kenji', 'Min-jae', 'Ahmed', 'Omar', 'Ivan', 'Marco', 'Mateo', 'Raj',
  'Chen', 'Ali', 'Juan', 'Liam', 'Noah', 'Aiden', 'Kai', 'Ravi', 'Takeshi', 'Pablo',
  'Lars', 'Niko', 'Samir', 'David', 'Adam', 'Ryan', 'Jun', 'Alex', 'Tom', 'Leo',
];

const BIOS = [
  "I'm learning English to travel the world and meet new people. Love watching movies in original language!",
  'Studying English for my career in international business. Every day I practice with podcasts and articles.',
  "English opens so many doors! I want to read academic papers and attend international conferences.",
  "I'm a language enthusiast. English is my third language and I'm enjoying every step of the journey.",
  'Living in a multicultural city, English is essential for daily communication. Let me practice with you!',
  "I started learning English last year and I'm already at B1 level. Consistency is the key!",
  'My dream is to study abroad in an English-speaking country. Working hard on my IELTS score.',
  "I love English literature and want to read classic novels in their original language.",
  "Working in IT, English is crucial for documentation and team communication. Improving every day!",
  'English helps me connect with people from all over the world. The internet is my classroom.',
  "I'm a teacher and I want to improve my English to better help my students learn.",
  'Music is my passion — I want to understand English song lyrics without translation!',
  'Studying English to pass the TOEFL exam for my university application abroad.',
  "I believe learning languages makes you a better person. English is my gateway to global culture.",
  "I'm preparing for a job interview in English. Practice makes perfect!",
  'English is the language of science. As a researcher, I need it every day for my work.',
  "I moved to an English-speaking country and I'm improving my skills to feel more at home.",
  "Travel blogger here! English helps me share my stories with a global audience.",
  "I'm learning English to watch my favorite TV shows without subtitles. Almost there!",
  'English for medical professionals — I need it to read research papers and communicate at conferences.',
  "I enjoy learning about different cultures through English. It's more than a language, it's a bridge!",
  'My goal is to become fluent enough to give presentations in English at work.',
  "I'm a food blogger and want to write my recipes in English to reach more people.",
  'Learning English through gaming and online communities. It has been a fun journey so far!',
  'I want to work remotely for international companies. English is the first step!',
  "Reading English books changed my perspective on so many things. Language shapes thought!",
  "I'm an artist and I want to share my work with the global art community in English.",
  'English helps me stay updated with technology news and global trends.',
  "I fell in love with English poetry. Now I want to write my own poems in English someday.",
  "I'm studying English because my partner speaks it and I want to communicate with their family.",
];

const COUNTRY_LANGUAGE_MAP: Record<string, string> = {
  'Brazil': 'pt',
  'Mexico': 'es',
  'Spain': 'es',
  'France': 'fr',
  'Germany': 'de',
  'Italy': 'it',
  'Japan': 'ja',
  'South Korea': 'ko',
  'China': 'zh',
  'India': 'hi',
  'Turkey': 'tr',
  'Saudi Arabia': 'ar',
  'Egypt': 'ar',
  'Nigeria': 'en',
  'South Africa': 'en',
  'Russia': 'ru',
  'Poland': 'pl',
  'Ukraine': 'uk',
  'Colombia': 'es',
  'Argentina': 'es',
  'Vietnam': 'vi',
  'Thailand': 'th',
  'Indonesia': 'id',
  'Philippines': 'tl',
  'Portugal': 'pt',
  'Netherlands': 'nl',
  'Sweden': 'sv',
  'Norway': 'no',
  'Greece': 'el',
  'Morocco': 'ar',
};

const INTERESTS = [
  'Technology', 'Business', 'Travel', 'Movies', 'Music', 'Sports', 'Reading',
  'Science', 'Art', 'Cooking', 'Gaming', 'Photography', 'Fitness', 'History',
  'Politics', 'Fashion', 'Nature', 'Education',
];

const OCCUPATIONS = [
  'Software Engineer', 'Teacher', 'Student', 'Doctor', 'Nurse', 'Marketing Manager',
  'Graphic Designer', 'Accountant', 'Lawyer', 'Architect', 'Journalist', 'Chef',
  'Data Analyst', 'Project Manager', 'Freelancer', 'Researcher', 'Entrepreneur',
  'Civil Engineer', 'Pharmacist', 'Writer', 'Photographer', 'Consultant', 'Banker',
  'Dentist', 'Psychologist', 'Mechanical Engineer', 'HR Manager', 'Sales Manager',
  'UX Designer', 'Translator',
];

// CEFR level distribution (weighted toward B1/B2)
const CEFR_DISTRIBUTION: Array<{ level: string; weight: number }> = [
  { level: 'A1', weight: 5 },
  { level: 'A2', weight: 10 },
  { level: 'B1', weight: 30 },
  { level: 'B2', weight: 30 },
  { level: 'C1', weight: 18 },
  { level: 'C2', weight: 7 },
];

// Proficiency level distribution
const PROFICIENCY_DISTRIBUTION: Array<{ level: string; weight: number }> = [
  { level: 'beginner', weight: 15 },
  { level: 'intermediate', weight: 50 },
  { level: 'advanced', weight: 30 },
  { level: 'native', weight: 5 },
];

const TIMEZONES = [
  'America/Sao_Paulo', 'America/Mexico_City', 'Europe/Madrid', 'Europe/Paris',
  'Europe/Berlin', 'Europe/Rome', 'Asia/Tokyo', 'Asia/Seoul', 'Asia/Shanghai',
  'Asia/Kolkata', 'Europe/Istanbul', 'Asia/Riyadh', 'Africa/Cairo', 'Africa/Lagos',
  'Africa/Johannesburg', 'Europe/Moscow', 'Europe/Warsaw', 'Europe/Kyiv',
  'America/Bogota', 'America/Buenos_Aires', 'Asia/Ho_Chi_Minh', 'Asia/Bangkok',
  'Asia/Jakarta', 'Asia/Manila', 'Europe/Lisbon', 'Europe/Amsterdam',
  'Europe/Stockholm', 'Europe/Oslo', 'Europe/Athens', 'Africa/Casablanca',
];

// ─── Helpers ──────────────────────────────────────────────

function weightedRandom<T extends { weight: number }>(items: T[]): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  for (const item of items) {
    random -= item.weight;
    if (random <= 0) return item;
  }
  return items[items.length - 1];
}

function getRandomInterests(): string[] {
  const count = 3 + Math.floor(Math.random() * 4); // 3-6 interests
  const shuffled = [...INTERESTS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getRandomTargetLanguages(nativeLanguage: string): string[] {
  // Most people are learning English, plus 0-2 other languages
  const languages = ['en', 'es', 'fr', 'de', 'ja', 'ko', 'zh', 'pt', 'it', 'ar', 'ru', 'hi', 'nl', 'sv', 'tr'];
  const targets: string[] = [];

  // Always include English if not native
  if (nativeLanguage !== 'en') {
    targets.push('en');
  }

  // Add 0-2 additional target languages
  const additional = Math.floor(Math.random() * 3);
  const available = languages.filter((l) => l !== nativeLanguage && !targets.includes(l));
  const shuffled = available.sort(() => Math.random() - 0.5);
  targets.push(...shuffled.slice(0, additional));

  return targets.length > 0 ? targets : ['en'];
}

function generateEmail(name: string, index: number): string {
  const clean = name.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/\s+/g, '');
  return `community.${clean}${index}@testcefr.com`;
}

// ─── Seed Route ───────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // Require admin auth
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminError = requireAdmin(authUser);
    if (adminError) return adminError;

    const passwordHash = await hashPassword('Community123!');

    let usersCreated = 0;
    let profilesCreated = 0;
    let usersSkipped = 0;

    for (let i = 0; i < 100; i++) {
      const isFemale = Math.random() < 0.5;
      const names = isFemale ? FEMALE_NAMES : MALE_NAMES;
      const name = names[i % names.length];
      const surname = COUNTRIES[i % COUNTRIES.length];
      const fullName = `${name} ${surname}`;
      const email = generateEmail(name, i);
      const country = COUNTRIES[i % COUNTRIES.length];
      const nativeLanguage = COUNTRY_LANGUAGE_MAP[country] || 'en';
      const timezone = TIMEZONES[i % TIMEZONES.length];

      // Check if user already exists
      const existing = await db.user.findUnique({ where: { email } });
      if (existing) {
        usersSkipped++;
        continue;
      }

      const cefrLevel = weightedRandom(CEFR_DISTRIBUTION).level;
      const proficiencyLevel = weightedRandom(PROFICIENCY_DISTRIBUTION).level;
      const isOnline = Math.random() < 0.3; // ~30% online
      const bio = BIOS[i % BIOS.length];
      const occupation = OCCUPATIONS[i % OCCUPATIONS.length];
      const interests = getRandomInterests();
      const targetLanguages = getRandomTargetLanguages(nativeLanguage);

      // Generate avatar color
      const avatarColors = [
        '3b82f6', 'ef4444', '10b981', 'f59e0b', '8b5cf6', 'ec4899',
        '06b6d4', 'f97316', '14b8a6', '6366f1', 'a855f7', '84cc16',
      ];
      const avatarColor = avatarColors[i % avatarColors.length];
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=${avatarColor}&color=fff&size=128`;

      // Random last seen within the last 7 days
      const lastSeenAt = new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));

      // Create user
      const user = await db.user.create({
        data: {
          email,
          name: fullName,
          passwordHash,
          country,
          avatarUrl,
          bio,
          englishLevel: cefrLevel,
          occupation,
          isDemo: true,
          isProfileComplete: true,
          emailVerified: true,
          isVerified: Math.random() < 0.4,
          trustScore: Math.floor(Math.random() * 60) + 10,
          interests: JSON.stringify(interests),
          plan: Math.random() < 0.15 ? 'premium' : 'free',
          role: 'user',
          gender: isFemale ? 'female' : 'male',
        },
      });

      usersCreated++;

      // Create language profile
      await db.languageProfile.create({
        data: {
          userId: user.id,
          nativeLanguage,
          targetLanguages: JSON.stringify(targetLanguages),
          proficiencyLevel,
          timezone,
          isDiscoverable: Math.random() < 0.85,
          isOnline,
          lastSeenAt,
        },
      });

      profilesCreated++;
    }

    return NextResponse.json({
      success: true,
      message: 'Community seeding completed.',
      result: {
        usersCreated,
        profilesCreated,
        usersSkipped,
      },
    });
  } catch (error) {
    console.error('Community seed error:', error);
    return NextResponse.json(
      { error: 'Internal server error during seeding.', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
