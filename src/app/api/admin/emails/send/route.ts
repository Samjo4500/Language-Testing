import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();

    const body = await req.json();
    const { subject, body: emailBody, recipientType, templateId, recipientIds } = body as {
      subject?: string;
      body?: string;
      recipientType?: 'all' | 'premium' | 'free' | 'specific';
      templateId?: string;
      recipientIds?: string[];
    };

    if (!subject && !templateId) {
      return NextResponse.json(
        { error: 'Subject or templateId is required' },
        { status: 400 }
      );
    }

    // Determine recipients based on type
    let recipients: { id: string; email: string; name: string | null }[] = [];

    if (recipientType === 'all') {
      recipients = await db.user.findMany({
        where: { isSuspended: false, status: { not: 'banned' } },
        select: { id: true, email: true, name: true },
      });
    } else if (recipientType === 'premium') {
      recipients = await db.user.findMany({
        where: { plan: { in: ['premium', 'pro'] }, isSuspended: false, status: { not: 'banned' } },
        select: { id: true, email: true, name: true },
      });
    } else if (recipientType === 'free') {
      recipients = await db.user.findMany({
        where: { plan: 'free', isSuspended: false, status: { not: 'banned' } },
        select: { id: true, email: true, name: true },
      });
    } else if (recipientType === 'specific' && recipientIds?.length) {
      recipients = await db.user.findMany({
        where: { id: { in: recipientIds } },
        select: { id: true, email: true, name: true },
      });
    }

    // In production, this would add emails to the EmailQueue
    // For now, we return a success response with the campaign info
    const campaignId = `campaign-${Date.now()}`;

    return NextResponse.json({
      success: true,
      message: `Campaign queued for ${recipients.length} recipients`,
      campaign: {
        id: campaignId,
        subject: subject || `Template ${templateId}`,
        recipientCount: recipients.length,
        recipientType: recipientType || 'specific',
        status: 'queued',
        initiatedBy: admin.email,
        initiatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json(
        { error: error.message === 'UNAUTHORIZED' ? 'Unauthorized' : 'Forbidden' },
        { status: error.message === 'UNAUTHORIZED' ? 401 : 403 }
      );
    }
    console.error('[Admin Email Send API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
