import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';
import { hashPassword } from '@/lib/auth';
import { adminLimiter } from '@/lib/rate-limit';

function generateRandomPassword(length = 12): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

function generateRandomSuffix(): string {
  return Math.random().toString(36).substring(2, 8);
}

/**
 * POST /api/admin/users/demo
 * Generate demo accounts.
 * Body: { count: number (1-10), plan: "free"|"premium" }
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
    const count = Math.min(10, Math.max(1, parseInt(String(body.count), 10) || 1));
    const plan = body.plan === 'premium' ? 'premium' : 'free';

    const credentials: Array<{ email: string; password: string; userId: string }> = [];

    for (let i = 0; i < count; i++) {
      const suffix = generateRandomSuffix();
      const email = `demo_${suffix}@testcefr.com`;
      const password = generateRandomPassword();
      const passwordHash = await hashPassword(password);

      const user = await db.user.create({
        data: {
          email,
          name: `Demo User ${suffix}`,
          passwordHash,
          plan,
          role: 'user',
          isDemo: true,
          emailVerified: true,
        },
      });

      credentials.push({
        email,
        password,
        userId: user.id,
      });
    }

    return NextResponse.json({
      message: `Created ${count} demo account(s) with plan "${plan}".`,
      credentials,
    });
  } catch (error) {
    console.error('Demo accounts error:', error);
    return NextResponse.json(
      { error: 'Failed to create demo accounts.' },
      { status: 500 }
    );
  }
}
