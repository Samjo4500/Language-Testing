import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/db-health';

/**
 * GET /api/health
 *
 * Database health check endpoint. Returns connectivity status and latency.
 * This endpoint is unauthenticated so monitoring systems can check it.
 */
export async function GET() {
  const dbHealth = await checkDatabaseHealth();

  const status = dbHealth.healthy ? 200 : 503;

  return NextResponse.json(
    {
      status: dbHealth.healthy ? 'ok' : 'unhealthy',
      database: {
        connected: dbHealth.healthy,
        latencyMs: dbHealth.latencyMs,
        error: dbHealth.error || undefined,
        errorType: dbHealth.errorType || undefined,
        url: dbHealth.url,
      },
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}
