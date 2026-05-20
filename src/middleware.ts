import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware for server-side route protection.
 * - Protected routes: /dashboard, /test, /admin, /payment-success, /pricing (authenticated only)
 * - Public routes: /, /login, /register, /forgot-password, /reset-password, /verify-email, /verify, /contact, /about, /privacy, /terms, /api/*
 * - Admin routes: /admin (requires admin role)
 */

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/test', '/payment-success'];

// Routes that require admin role
const ADMIN_ROUTES = ['/admin'];

// Routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes and static files
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Read auth token from cookies (we set these during login for middleware use)
  const accessToken = request.cookies.get('auth_token')?.value;
  const userRole = request.cookies.get('user_role')?.value;

  // Check if route requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

  // Protected route without auth → redirect to login
  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin route without admin role → redirect to dashboard
  if (isAdminRoute && (!accessToken || userRole !== 'admin')) {
    if (!accessToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Auth route with valid auth → redirect to dashboard
  if (isAuthRoute && accessToken) {
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
