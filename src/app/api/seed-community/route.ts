import { NextRequest, NextResponse } from 'next/server';
import { seedCommunity } from '@/lib/seed-community';
import { getAuthUser } from '@/lib/auth-middleware';

// POST: Seed community with fake tutors and chat messages
// This endpoint is idempotent - safe to call multiple times
export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await seedCommunity();

    return NextResponse.json({
      success: true,
      message: 'Community seeding completed.',
      result,
    });
  } catch (error) {
    console.error('Seed community error:', error);
    return NextResponse.json(
      { error: 'Internal server error during seeding.' },
      { status: 500 }
    );
  }
}
