import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

/**
 * Middleware for server-side route protection.
 * - Protected routes: /dashboard, /test, /payment-success
 * - Admin routes: /admin (requires admin role from VERIFIED JWT)
 * - Auth routes: /login, /register (redirect to dashboard if authenticated)
 *
 * SECURITY: Role is extracted from the VERIFIED JWT token, NOT from a client-set cookie.
 */

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me';

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/test', '/payment-success'];

// Routes that require admin role
const ADMIN_ROUTES = ['/admin'];

// Routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = ['/login', '/register'];

interface TokenPayload {
  userId: string;
  email: string;
  plan: string;
  role?: string;
}

function verifyTokenSafely(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes and static files
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Read auth token from cookie and VERIFY the JWT
  const accessToken = request.cookies.get('auth_token')?.value;
  const tokenPayload = accessToken ? verifyTokenSafely(accessToken) : null;

  // Extract role from verified JWT — NEVER trust a client-set cookie for role
  const userRole = tokenPayload?.role || 'user';

  // Check if route requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

  // Protected route without valid auth → redirect to login
  if (isProtectedRoute && !tokenPayload) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin route without admin role → redirect to dashboard
  if (isAdminRoute && (!tokenPayload || userRole !== 'admin')) {
    if (!tokenPayload) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Auth route with valid auth → redirect to dashboard
  if (isAuthRoute && tokenPayload) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
