import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/test', '/payment-success', '/admin'];

// Routes that only admins can access
const ADMIN_ROUTES = ['/admin'];

// Routes that authenticated users should be redirected away from (e.g., to dashboard)
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get access token from cookies
  const accessToken = request.cookies.get('accessToken')?.value;

  // Verify the token if present
  let user: { userId: string; email: string; plan: string; role?: string } | null = null;
  if (accessToken) {
    user = verifyToken(accessToken);
  }

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  // Check if the route requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  const isAdminRoute = ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect non-admin users from admin routes to dashboard
  if (isAdminRoute && isAuthenticated && !isAdmin) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect authenticated users away from auth pages (login, register, etc.)
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, logo-icon.svg, etc. (public files)
     * - verify-email, verify (public pages)
     */
    '/((?!api|_next/static|_next/image|favicon\\.ico|logo-icon\\.svg|.*\\.png|.*\\.jpg|.*\\.svg|verify-email|verify).*)',
  ],
};
