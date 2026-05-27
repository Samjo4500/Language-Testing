import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';

// In-memory feature flags store
let featureFlags: Record<string, boolean> = {
  assessments: true,
  courses: true,
  community: true,
  vocabulary: true,
  certificates: true,
  apiAccess: false,
  whiteLabel: false,
  aiTutor: true,
  speakingTests: true,
  writingTests: true,
  emailQueue: true,
  maintenance: false,
};

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin();

    // Also check WhiteLabelSetting features
    const whiteLabel = await db.whiteLabelSetting.findFirst({
      where: { isActive: true },
    });

    let dbFeatures: Record<string, boolean> = {};
    if (whiteLabel?.features) {
      try {
        dbFeatures = JSON.parse(whiteLabel.features);
      } catch {
        // ignore parse errors
      }
    }

    const flags = {
      ...featureFlags,
      ...dbFeatures,
    };

    return NextResponse.json({ features: flags });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json(
        { error: error.message === 'UNAUTHORIZED' ? 'Unauthorized' : 'Forbidden' },
        { status: error.message === 'UNAUTHORIZED' ? 401 : 403 }
      );
    }
    console.error('[Admin Features API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin();

    const body = await req.json();
    const { features } = body as { features: Record<string, boolean> };

    if (!features || typeof features !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request: features object required' },
        { status: 400 }
      );
    }

    // Update in-memory flags
    featureFlags = {
      ...featureFlags,
      ...features,
    };

    // Also persist in WhiteLabelSetting
    const existing = await db.whiteLabelSetting.findFirst({ where: { isActive: true } });
    if (existing) {
      await db.whiteLabelSetting.update({
        where: { id: existing.id },
        data: { features: JSON.stringify(featureFlags) },
      });
    } else {
      await db.whiteLabelSetting.create({
        data: {
          features: JSON.stringify(featureFlags),
          isActive: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      features: featureFlags,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json(
        { error: error.message === 'UNAUTHORIZED' ? 'Unauthorized' : 'Forbidden' },
        { status: error.message === 'UNAUTHORIZED' ? 401 : 403 }
      );
    }
    console.error('[Admin Features API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
