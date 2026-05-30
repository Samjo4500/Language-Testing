import { NextResponse } from 'next/server';

export async function GET() {
  // Intentionally returns minimal info — do not expose stack, version, or env details.
  return NextResponse.json({ status: 'ok' });
}
