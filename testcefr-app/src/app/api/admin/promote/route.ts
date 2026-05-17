import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth-middleware';

/**
 * POST /api/admin/promote
 * Promote a user to admin by email. Only existing admins can call this.
 * Body: { email: string }
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
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    if (user.role === 'admin') {
      return NextResponse.json({ message: 'User is already an admin.' });
    }

    await db.user.update({
      where: { id: user.id },
      data: { role: 'admin' },
    });

    return NextResponse.json({ message: `${email} has been promoted to admin.` });
  } catch (error) {
    console.error('Promote error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
