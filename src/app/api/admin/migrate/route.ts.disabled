import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireAdmin } from '@/lib/auth-middleware';
import { execSync } from 'child_process';

/**
 * POST /api/admin/migrate
 *
 * Run Prisma schema push to sync the database.
 * Admin only. Used when schema changes are deployed and need to be applied.
 *
 * This should be called after deploying code changes that include Prisma schema updates.
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const adminError = requireAdmin(authResult);
    if (adminError) return adminError;

    // Run prisma db push
    const output = execSync('npx prisma db push --skip-generate --accept-data-loss 2>&1', {
      encoding: 'utf-8',
      timeout: 120000,
      env: {
        ...process.env,
        // Use the unpooledd URL for migrations
        DATABASE_URL: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL,
      },
    });

    return NextResponse.json({
      success: true,
      output: output.substring(0, 2000),
    });
  } catch (error: any) {
    console.error('[Admin Migrate Error]', error);
    return NextResponse.json(
      {
        error: 'Migration failed',
        details: error.message?.substring(0, 500),
        stdout: error.stdout?.substring(0, 500),
        stderr: error.stderr?.substring(0, 500),
      },
      { status: 500 },
    );
  }
}
