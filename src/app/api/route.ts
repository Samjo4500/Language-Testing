import { NextResponse } from 'next/server';

export async function GET() {
  // Return 404 to avoid exposing API existence to attackers
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
