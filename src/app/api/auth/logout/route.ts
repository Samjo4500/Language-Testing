import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth-middleware';
import { clearAuthCookies } from '@/lib/cookie-auth';

/**
 * POST /api/auth/logout
 *
 * Invalidates all existing JWT tokens for the user by incrementing their tokenVersion.
 * This ensures that even if an access/refresh token is stolen, it becomes useless
 * after the user logs out.
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = getAuthUser(request);
    if (authResult) {
      // Increment tokenVersion to invalidate all existing tokens
      await db.user.update({
        where: { id: authResult.userId },
        data: {
          tokenVersion: { increment: 1 },
        },
      });
    }

    const response = NextResponse.json({
      message: 'Logged out successfully.',
    });
    clearAuthCookies(response);
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    // Even if the DB update fails, return success so the client clears its state
    const response = NextResponse.json({
      message: 'Logged out successfully.',
    });
    clearAuthCookies(response);
    return response;
  }
}
