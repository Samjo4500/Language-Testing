import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Count language profiles (community members)
    let count = await db.languageProfile.count();
    // If no language profiles, count all users as a fallback
    // This ensures Community appears once there are users in the system
    if (count === 0) {
      count = await db.user.count();
    }
    return NextResponse.json({ count });
  } catch {
    // Fallback: count users
    try {
      const userCount = await db.user.count();
      return NextResponse.json({ count: userCount });
    } catch {
      return NextResponse.json({ count: 0 });
    }
  }
}
