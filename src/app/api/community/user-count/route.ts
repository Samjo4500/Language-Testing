import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const count = await db.languageProfile.count();
    return NextResponse.json({ count });
  } catch {
    // Fallback: count users
    const userCount = await db.user.count();
    return NextResponse.json({ count: userCount });
  }
}
