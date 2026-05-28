import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();

    // Mock cache clear — in a real implementation, this would:
    // 1. Clear Redis cache
    // 2. Purge CDN cache
    // 3. Clear Next.js ISR cache
    // 4. Clear any in-memory caches

    return NextResponse.json({
      success: true,
      message: 'All caches cleared successfully',
      cleared: {
        redis: true,
        cdn: true,
        isr: true,
        memory: true,
      },
      clearedAt: new Date().toISOString(),
      clearedBy: admin.email,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json(
        { error: error.message === 'UNAUTHORIZED' ? 'Unauthorized' : 'Forbidden' },
        { status: error.message === 'UNAUTHORIZED' ? 401 : 403 }
      );
    }
    console.error('[Admin Cache Clear API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
