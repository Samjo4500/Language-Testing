/**
 * FIX #2: Community "New" Badge + Profile Seeding
 * 
 * Provides TWO options:
 * Option A: Quick hide (10 minutes) - removes badge and conditionally shows nav
 * Option B: Profile seeder (4 hours) - generates 100 realistic profiles
 */

// ============================================================
// OPTION A: QUICK HIDE (10 minutes)
// Drop this into your Navigation component or layout
// ============================================================

import React from 'react';

interface NavItem {
  label: string;
  href: string;
  isNew?: boolean;
  requiresMinUsers?: boolean;
}

/**
 * useCommunityVisibility Hook
 * 
 * Controls whether the Community nav item and badge are shown
 * based on actual user count.
 */
export const useCommunityVisibility = (minUsersRequired: number = 50) => {
  // Query your actual user count from API/database
  // For now, using a fetch - replace with your actual data source
  const [userCount, setUserCount] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Replace this with your actual API endpoint
    fetch('/api/community/user-count')
      .then(res => res.json())
      .then(data => {
        setUserCount(data.count || 0);
        setLoading(false);
      })
      .catch(() => {
        // If API fails, hide by default (safe fallback)
        setUserCount(0);
        setLoading(false);
      });
  }, []);

  const shouldShowCommunity = userCount >= minUsersRequired;
  const shouldShowNewBadge = false; // Never show "New" badge (remove after launch)

  return { shouldShowCommunity, shouldShowNewBadge, userCount, loading };
};

/**
 * NavigationItem Component - replaces your existing nav item
 */
export const CommunityNavItem: React.FC = () => {
  const { shouldShowCommunity, shouldShowNewBadge, userCount } = useCommunityVisibility(50);

  // If fewer than 50 users, don't render the nav item at all
  if (!shouldShowCommunity) {
    return null;
  }

  return (
    <a
      href="/community/"
      className="nav-item"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        color: 'rgba(255, 255, 255, 0.8)',
        textDecoration: 'none',
        borderRadius: '0.5rem',
        transition: 'background 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent';
      }}
    >
      {/* Community icon */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>

      <span>Community</span>

      {/* Only show badge if enabled (currently forced off) */}
      {shouldShowNewBadge && (
        <span
          style={{
            background: 'linear-gradient(135deg, #a78bfa, #c084fc)',
            color: '#fff',
            fontSize: '0.625rem',
            fontWeight: 600,
            padding: '0.125rem 0.5rem',
            borderRadius: '9999px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          New
        </span>
      )}

      {/* Show user count instead of "New" badge */}
      {!shouldShowNewBadge && userCount > 0 && (
        <span
          style={{
            background: 'rgba(74, 222, 128, 0.15)',
            color: '#4ade80',
            fontSize: '0.625rem',
            fontWeight: 600,
            padding: '0.125rem 0.5rem',
            borderRadius: '9999px',
          }}
        >
          {userCount} online
        </span>
      )}
    </a>
  );
};


// ============================================================
// OPTION B: PROFILE SEEDER SCRIPT (4 hours to implement)
// Run this once to populate your community database
// ============================================================

// Types for the profile seeder
interface SeedProfile {
  id: string;
  name: string;
  nativeLanguage: string;
  learningLanguage: string;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  country: string;
  gender: 'male' | 'female' | 'non-binary';
  bio: string;
  interests: string[];
  isOnline: boolean;
  lastActive: string;
  avatar: string; // URL or color initial
}

// Realistic seed data - 100 diverse profiles
const COUNTRIES = [
  'Brazil', 'Mexico', 'Spain', 'France', 'Germany', 'Italy', 'Japan', 
  'South Korea', 'China', 'India', 'Turkey', 'Saudi Arabia', 'Egypt',
  'Nigeria', 'South Africa', 'Russia', 'Poland', 'Ukraine', 'Colombia',
  'Argentina', 'Vietnam', 'Thailand', 'Indonesia', 'Philippines',
  'Portugal', 'Netherlands', 'Sweden', 'Norway', 'Greece', 'Morocco'
];

const NATIVE_LANGUAGES = [
  'Spanish', 'Portuguese', 'French', 'German', 'Japanese', 'Korean',
  'Chinese', 'Arabic', 'Russian', 'Italian', 'Turkish', 'Hindi',
  'Vietnamese', 'Thai', 'Indonesian', 'Polish', 'Ukrainian', 'Greek'
];

const FIRST_NAMES = {
  female: [
    'Sofia', 'Maria', 'Emma', 'Yuki', 'Ji-eun', 'Wei', 'Aisha', 'Fatima',
    'Anastasia', 'Isabella', 'Camila', 'Priya', 'Mei', 'Elena', 'Nadia',
    'Lina', 'Amira', 'Klara', 'Ingrid', 'Eva', 'Aria', 'Mia', 'Zara',
    'Leila', 'Chiara', 'Ana', 'Laura', 'Sana', 'Yuna', 'Hana'
  ],
  male: [
    'Lucas', 'Hugo', 'Kenji', 'Min-jae', 'Ahmed', 'Omar', 'Ivan',
    'Marco', 'Mateo', 'Raj', 'Chen', 'Ali', 'Juan', 'Liam', 'Noah',
    'Aiden', 'Kai', 'Ravi', 'Takeshi', 'Pablo', 'Lars', 'Niko',
    'Samir', 'David', 'Adam', 'Ryan', 'Jun', 'Alex', 'Tom', 'Leo'
  ]
};

const BIOS = [
  'Learning English for my career in tech. Love discussing AI and startups!',
  'Preparing for IELTS. Looking for speaking partners to practice daily.',
  'English teacher in training. Happy to help beginners!',
  'Studying abroad next year. Need to reach B2 by December.',
  'Business professional looking to improve presentation skills.',
  'Love movies and books. Want to discuss literature in English!',
  'Travel enthusiast. Learning English to explore the world.',
  'Medical student. Need English for research papers and conferences.',
  'Self-taught learner. 6 months in, already at B1!',
  'Looking for serious study partners. Let\'s practice 30 min daily.',
  'Engineer working remotely for a US company. Need to improve fluency.',
  'Passionate about languages. Currently learning English and French.',
  'University student preparing for exchange program.',
  'Freelance designer with international clients. English is essential!',
  'Love British accents. Trying to sound more natural when I speak.',
];

const INTERESTS_POOL = [
  'Technology', 'Business', 'Travel', 'Movies', 'Music', 'Sports',
  'Reading', 'Science', 'Art', 'Cooking', 'Gaming', 'Photography',
  'Fitness', 'History', 'Politics', 'Fashion', 'Nature', 'Education'
];

/**
 * Generates a single realistic profile
 */
function generateProfile(index: number): SeedProfile {
  const gender = Math.random() > 0.5 ? 'male' : 'female';
  const names = gender === 'male' ? FIRST_NAMES.male : FIRST_NAMES.female;
  const name = names[index % names.length];
  const country = COUNTRIES[index % COUNTRIES.length];
  const nativeLang = NATIVE_LANGUAGES[index % NATIVE_LANGUAGES.length];
  
  // Weight CEFR levels toward intermediate (most realistic)
  const levelRoll = Math.random();
  let cefrLevel: SeedProfile['cefrLevel'];
  if (levelRoll < 0.1) cefrLevel = 'A1';
  else if (levelRoll < 0.25) cefrLevel = 'A2';
  else if (levelRoll < 0.5) cefrLevel = 'B1';
  else if (levelRoll < 0.75) cefrLevel = 'B2';
  else if (levelRoll < 0.9) cefrLevel = 'C1';
  else cefrLevel = 'C2';

  // 30% chance of being online
  const isOnline = Math.random() < 0.3;
  
  // Random last active time (within last 7 days)
  const hoursAgo = Math.floor(Math.random() * 168);
  const lastActive = new Date(Date.now() - hoursAgo * 3600000).toISOString();

  // Pick 2-4 random interests
  const shuffled = [...INTERESTS_POOL].sort(() => Math.random() - 0.5);
  const interests = shuffled.slice(0, 2 + Math.floor(Math.random() * 3));

  return {
    id: `seed-profile-${index}`,
    name,
    nativeLanguage: nativeLang,
    learningLanguage: 'English',
    cefrLevel,
    country,
    gender,
    bio: BIOS[index % BIOS.length],
    interests,
    isOnline,
    lastActive,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`,
  };
}

/**
 * Generates 100 seed profiles
 */
export function generateSeedProfiles(count: number = 100): SeedProfile[] {
  return Array.from({ length: count }, (_, i) => generateProfile(i));
}

// ============================================================
// SEEDING API ROUTE (Next.js App Router)
// File: app/api/community/seed/route.ts
// ============================================================

/*
// Copy this into your Next.js app:

import { NextRequest, NextResponse } from 'next/server';
import { generateSeedProfiles } from './profile-seeder';

// IMPORTANT: Add admin authorization before deploying
export async function POST(req: NextRequest) {
  // Admin check - replace with your auth logic
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.ADMIN_SEED_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const profiles = generateSeedProfiles(100);
    
    // Insert into your database
    // Replace with your actual DB client (Prisma, Drizzle, etc.)
    const result = await db.communityProfiles.createMany({
      data: profiles.map(p => ({
        ...p,
        isSeedProfile: true, // Mark as seed for easy cleanup later
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      inserted: result.count,
      message: `Seeded ${result.count} community profiles`
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to seed profiles', details: error.message },
      { status: 500 }
    );
  }
}

// Cleanup route - remove seed profiles when you have real users
export async function DELETE(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.ADMIN_SEED_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await db.communityProfiles.deleteMany({
    where: { isSeedProfile: true }
  });

  return NextResponse.json({
    success: true,
    deleted: result.count,
    message: `Removed ${result.count} seed profiles`
  });
}

*/


// ============================================================
// COMMUNITY PAGE EMPTY STATE COMPONENT
// Replace your current empty state with this
// ============================================================

export const CommunityEmptyState: React.FC<{ hasSeedProfiles?: boolean }> = ({ 
  hasSeedProfiles = false 
}) => {
  if (hasSeedProfiles) {
    // This should never show if seeding worked
    return null;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.6)',
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(167, 139, 250, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>
        Be the First to Join!
      </h3>

      <p style={{ maxWidth: 400, marginBottom: '1.5rem', lineHeight: 1.6 }}>
        Our community is growing. Create your profile now and start connecting 
        with English learners from around the world.
      </p>

      <a
        href="/community/profile/create"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 2rem',
          background: 'linear-gradient(135deg, #a78bfa, #c084fc)',
          color: '#fff',
          borderRadius: '0.75rem',
          textDecoration: 'none',
          fontWeight: 600,
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(167, 139, 250, 0.3)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        Create Your Profile
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
};

export { generateProfile };
