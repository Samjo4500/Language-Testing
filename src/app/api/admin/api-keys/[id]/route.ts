import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';

/**
 * PATCH /api/admin/api-keys/[id]
 * Update an API key (toggle active, update permissions, etc.)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const adminCheck = requireAdmin(authResult);
    if (adminCheck) return adminCheck;

    const { id } = await params;
    const body = await request.json();

    const existing = await db.apiKey.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'API key not found.' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.permissions !== undefined) updateData.permissions = JSON.stringify(body.permissions);
    if (body.rateLimit !== undefined) updateData.rateLimit = Number(body.rateLimit);
    if (body.name !== undefined) updateData.name = body.name;
    if (body.plan !== undefined) updateData.plan = body.plan;

    const updated = await db.apiKey.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        key: true,
        name: true,
        userId: true,
        plan: true,
        type: true,
        permissions: true,
        rateLimit: true,
        isActive: true,
        lastUsedAt: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { id: true, email: true, name: true } },
      },
    });

    // Mask key in response
    return NextResponse.json({
      apiKey: { ...updated, key: updated.key.slice(0, 12) + '••••••••' },
    });
  } catch (error) {
    console.error('API key update error:', error);
    return NextResponse.json({ error: 'Failed to update API key.' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/api-keys/[id]
 * Revoke (delete) an API key.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const adminCheck = requireAdmin(authResult);
    if (adminCheck) return adminCheck;

    const { id } = await params;

    const existing = await db.apiKey.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'API key not found.' }, { status: 404 });
    }

    await db.apiKey.delete({ where: { id } });

    return NextResponse.json({ message: 'API key revoked successfully.' });
  } catch (error) {
    console.error('API key delete error:', error);
    return NextResponse.json({ error: 'Failed to revoke API key.' }, { status: 500 });
  }
}
