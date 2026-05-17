import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';

const DEFAULT_SETTINGS = {
  companyName: 'TestCEFR',
  primaryColor: '#8B5CF6',
  logoUrl: '',
  domain: '',
  supportEmail: '',
  customCss: '',
  features: '{}',
  isActive: false,
  plan: 'enterprise',
};

/**
 * GET /api/admin/white-label
 * Get white-label settings. Returns defaults if none exist.
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const adminCheck = requireAdmin(authResult);
    if (adminCheck) return adminCheck;

    const settings = await db.whiteLabelSetting.findFirst();

    if (!settings) {
      return NextResponse.json({ settings: DEFAULT_SETTINGS });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('White-label GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch white-label settings.' }, { status: 500 });
  }
}

/**
 * POST/PATCH /api/admin/white-label
 * Create or update white-label settings.
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const adminCheck = requireAdmin(authResult);
    if (adminCheck) return adminCheck;

    const body = await request.json();

    const existing = await db.whiteLabelSetting.findFirst();

    let settings;
    if (existing) {
      const updateData: Record<string, unknown> = {};
      if (body.companyName !== undefined) updateData.companyName = body.companyName;
      if (body.primaryColor !== undefined) updateData.primaryColor = body.primaryColor;
      if (body.logoUrl !== undefined) updateData.logoUrl = body.logoUrl;
      if (body.domain !== undefined) updateData.domain = body.domain;
      if (body.supportEmail !== undefined) updateData.supportEmail = body.supportEmail;
      if (body.customCss !== undefined) updateData.customCss = body.customCss;
      if (body.features !== undefined) updateData.features = typeof body.features === 'string' ? body.features : JSON.stringify(body.features);
      if (body.isActive !== undefined) updateData.isActive = body.isActive;
      if (body.plan !== undefined) updateData.plan = body.plan;

      settings = await db.whiteLabelSetting.update({
        where: { id: existing.id },
        data: updateData,
      });
    } else {
      settings = await db.whiteLabelSetting.create({
        data: {
          companyName: body.companyName || DEFAULT_SETTINGS.companyName,
          primaryColor: body.primaryColor || DEFAULT_SETTINGS.primaryColor,
          logoUrl: body.logoUrl || null,
          domain: body.domain || null,
          supportEmail: body.supportEmail || null,
          customCss: body.customCss || null,
          features: body.features ? (typeof body.features === 'string' ? body.features : JSON.stringify(body.features)) : DEFAULT_SETTINGS.features,
          isActive: body.isActive ?? DEFAULT_SETTINGS.isActive,
          plan: body.plan || DEFAULT_SETTINGS.plan,
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('White-label POST error:', error);
    return NextResponse.json({ error: 'Failed to save white-label settings.' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/white-label
 * Update white-label settings (alias for POST).
 */
export async function PATCH(request: NextRequest) {
  return POST(request);
}
