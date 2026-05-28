import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';

// In-memory store for settings that don't have a dedicated model
let siteSettings: Record<string, unknown> = {
  siteName: 'TestCEFR',
  siteDescription: 'AI-Powered CEFR English Assessment Platform',
  supportEmail: 'support@testcefr.com',
  maintenanceMode: false,
  registrationOpen: true,
  maxTestsPerDay: 3,
  defaultPlan: 'free',
  emailNotifications: true,
  analyticsTracking: true,
  cookieConsentRequired: true,
  defaultLanguage: 'en',
  timezone: 'UTC',
};

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin();

    // Try to load from WhiteLabelSetting if available
    const whiteLabel = await db.whiteLabelSetting.findFirst({
      where: { isActive: true },
    });

    const settings = {
      ...siteSettings,
      ...(whiteLabel
        ? {
            siteName: whiteLabel.companyName,
            primaryColor: whiteLabel.primaryColor,
            logoUrl: whiteLabel.logoUrl,
            domain: whiteLabel.domain,
            supportEmail: whiteLabel.supportEmail,
            customCss: whiteLabel.customCss,
          }
        : {}),
    };

    return NextResponse.json({ settings });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json(
        { error: error.message === 'UNAUTHORIZED' ? 'Unauthorized' : 'Forbidden' },
        { status: error.message === 'UNAUTHORIZED' ? 401 : 403 }
      );
    }
    console.error('[Admin Settings API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin();

    const body = await req.json();

    // Update in-memory settings
    siteSettings = {
      ...siteSettings,
      ...body,
    };

    // If WhiteLabelSetting fields are present, update or create
    const wlFields = ['companyName', 'primaryColor', 'logoUrl', 'domain', 'supportEmail', 'customCss', 'features'];
    const hasWlFields = Object.keys(body).some((key) => wlFields.includes(key));

    if (hasWlFields) {
      const existing = await db.whiteLabelSetting.findFirst({ where: { isActive: true } });
      if (existing) {
        await db.whiteLabelSetting.update({
          where: { id: existing.id },
          data: {
            ...(body.companyName && { companyName: body.companyName }),
            ...(body.primaryColor && { primaryColor: body.primaryColor }),
            ...(body.logoUrl && { logoUrl: body.logoUrl }),
            ...(body.domain && { domain: body.domain }),
            ...(body.supportEmail && { supportEmail: body.supportEmail }),
            ...(body.customCss && { customCss: body.customCss }),
            ...(body.features && { features: JSON.stringify(body.features) }),
          },
        });
      } else {
        await db.whiteLabelSetting.create({
          data: {
            companyName: body.companyName || 'TestCEFR',
            primaryColor: body.primaryColor || '#8B5CF6',
            logoUrl: body.logoUrl,
            domain: body.domain,
            supportEmail: body.supportEmail,
            customCss: body.customCss,
            features: body.features ? JSON.stringify(body.features) : '{}',
            isActive: true,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      settings: siteSettings,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json(
        { error: error.message === 'UNAUTHORIZED' ? 'Unauthorized' : 'Forbidden' },
        { status: error.message === 'UNAUTHORIZED' ? 401 : 403 }
      );
    }
    console.error('[Admin Settings API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
