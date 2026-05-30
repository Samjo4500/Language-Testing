import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-middleware';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET: Return user's digest settings (create default if none)
export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in.' },
        { status: 401 }
      );
    }

    const userId = user.userId;

    // Get or create digest settings
    let settings = await db.userDigestSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await db.userDigestSettings.create({
        data: { userId },
      });
    }

    return NextResponse.json({
      settings,
    });
  } catch (error) {
    console.error('[digests/settings] GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to fetch digest settings.' },
      { status: 500 }
    );
  }
}

// POST: Update digest settings
export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in.' },
        { status: 401 }
      );
    }

    const userId = user.userId;
    const body = await request.json();

    // Validate boolean fields
    const booleanFields = [
      'weeklyProgress',
      'streakReminder',
      'milestoneAlert',
      'recommendations',
      'communityUpdate',
      'monthlyDeepDive',
    ];

    const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    const data: Record<string, unknown> = {};

    for (const field of booleanFields) {
      if (body[field] !== undefined) {
        if (typeof body[field] !== 'boolean') {
          return NextResponse.json(
            { error: 'Bad request', message: `${field} must be a boolean.` },
            { status: 400 }
          );
        }
        data[field] = body[field];
      }
    }

    if (body.preferredDay !== undefined) {
      if (!validDays.includes(body.preferredDay)) {
        return NextResponse.json(
          { error: 'Bad request', message: `preferredDay must be one of: ${validDays.join(', ')}` },
          { status: 400 }
        );
      }
      data.preferredDay = body.preferredDay;
    }

    if (body.preferredTime !== undefined) {
      if (typeof body.preferredTime !== 'string' || !/^\d{2}:\d{2}$/.test(body.preferredTime)) {
        return NextResponse.json(
          { error: 'Bad request', message: 'preferredTime must be in HH:MM format.' },
          { status: 400 }
        );
      }
      data.preferredTime = body.preferredTime;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: 'Bad request', message: 'No valid fields to update.' },
        { status: 400 }
      );
    }

    // Upsert settings
    const settings = await db.userDigestSettings.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });

    return NextResponse.json({
      message: 'Digest settings updated successfully.',
      settings,
    });
  } catch (error) {
    console.error('[digests/settings] POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to update digest settings.' },
      { status: 500 }
    );
  }
}
