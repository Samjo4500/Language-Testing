import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

/**
 * Require admin role for API routes.
 * Gets the auth token from cookies, verifies the JWT,
 * checks role === 'admin', and throws 403 if not admin.
 */
export async function requireAdmin() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    throw new Error('UNAUTHORIZED');
  }

  const payload = verifyToken(accessToken);
  if (!payload) {
    throw new Error('UNAUTHORIZED');
  }

  if (payload.role !== 'admin') {
    throw new Error('FORBIDDEN');
  }

  // Verify user still exists and is active
  const user = await db.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, role: true, status: true, name: true },
  });

  if (!user || user.status === 'banned') {
    throw new Error('FORBIDDEN');
  }

  return {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };
}

/**
 * Alternative: requireAdmin from a NextRequest object.
 * Useful when cookies() is not available in certain contexts.
 */
export async function requireAdminFromRequest(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;

  if (!accessToken) {
    throw new Error('UNAUTHORIZED');
  }

  const payload = verifyToken(accessToken);
  if (!payload) {
    throw new Error('UNAUTHORIZED');
  }

  if (payload.role !== 'admin') {
    throw new Error('FORBIDDEN');
  }

  const user = await db.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, role: true, status: true, name: true },
  });

  if (!user || user.status === 'banned') {
    throw new Error('FORBIDDEN');
  }

  return {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };
}

/**
 * Create a standardized error response for admin routes.
 */
export function adminErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown error';

  if (message === 'UNAUTHORIZED') {
    return new Response(JSON.stringify({ error: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (message === 'FORBIDDEN') {
    return new Response(JSON.stringify({ error: 'Admin access required' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  console.error('[Admin API Error]', error);
  return new Response(JSON.stringify({ error: 'Internal server error' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
}
