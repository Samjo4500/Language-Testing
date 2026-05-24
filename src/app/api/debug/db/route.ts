import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Try to find the admin user
    const user = await db.user.findUnique({ where: { email: 'admin@testcefr.com' } });
    return NextResponse.json({ success: true, user: user ? { id: user.id, email: user.email, role: user.role } : null });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      meta: error.meta,
    }, { status: 500 });
  }
}
