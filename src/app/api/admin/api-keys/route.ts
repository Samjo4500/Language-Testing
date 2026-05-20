import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';
import { randomBytes } from 'crypto';
import { adminLimiter } from '@/lib/rate-limit';

/**
 * GET /api/admin/api-keys
 * List all API keys with user info.
 */
export async function GET(request: NextRequest) {
  // Rate limit: 60 requests per minute per IP
  const limitError = adminLimiter(request);
  if (limitError) return limitError;

  try {
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const adminCheck = requireAdmin(authResult);
    if (adminCheck) return adminCheck;

    const apiKeys = await db.apiKey.findMany({
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
        user: {
          select: { id: true, email: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Mask keys in list response
    const masked = apiKeys.map((k) => ({
      ...k,
      key: k.key.slice(0, 12) + '••••••••',
    }));

    return NextResponse.json({ apiKeys: masked });
  } catch (error) {
    console.error('API keys list error:', error);
    return NextResponse.json({ error: 'Failed to fetch API keys.' }, { status: 500 });
  }
}

/**
 * POST /api/admin/api-keys
 * Generate a new API key.
 * Body: { name, plan, type, permissions, rateLimit }
 */
export async function POST(request: NextRequest) {
  // Rate limit: 60 requests per minute per IP
  const limitError = adminLimiter(request);
  if (limitError) return limitError;

  try {
    const authResult = getAuthUser(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const adminCheck = requireAdmin(authResult);
    if (adminCheck) return adminCheck;

    const body = await request.json();
    const { name, plan = 'enterprise', type = 'live', permissions = ['read'], rateLimit = 1000 } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Key name is required.' }, { status: 400 });
    }

    // Generate a unique API key
    const prefix = type === 'test' ? 'tcefr_test_' : 'tcefr_live_';
    const rawKey = prefix + randomBytes(24).toString('hex');

    const apiKey = await db.apiKey.create({
      data: {
        key: rawKey,
        name: name.trim(),
        userId: authResult.userId,
        plan,
        type,
        permissions: JSON.stringify(permissions),
        rateLimit: Number(rateLimit) || 1000,
      },
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
        expiresAt: true,
        createdAt: true,
        user: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    // Return the full key only on creation
    return NextResponse.json({ apiKey }, { status: 201 });
  } catch (error) {
    console.error('API key creation error:', error);
    return NextResponse.json({ error: 'Failed to create API key.' }, { status: 500 });
  }
}
