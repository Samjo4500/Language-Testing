import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

/**
 * Middleware for server-side route protection and security headers.
 *
 * Route Protection:
 * - Protected routes: /dashboard, /test, /payment-success
 * - Admin routes: /admin (requires admin role from VERIFIED JWT)
 * - Auth routes: /login, /register (redirect to dashboard if authenticated)
 *
 * Security: Role is extracted from the VERIFIED JWT token, NOT from a client-set cookie.
 */

const JWT_SECRET = process.env.JWT_SECRET || '';

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

/**
 * Add security headers to every response.
 * These headers protect against common web vulnerabilities:
 * - Clickjacking (X-Frame-Options)
 * - MIME type sniffing (X-Content-Type-Options)
 * - XSS via Content-Security-Policy
 * - Information leakage via Referrer-Policy
 * - Protocol downgrade via HSTS
 * - Feature access via Permissions-Policy
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent clickjacking — only allow framing from same origin
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');

  // Prevent MIME type sniffing — browser must respect declared Content-Type
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Control referrer information sent to other sites
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Force HTTPS for 2 years (63072000 seconds), include subdomains, allow preloading
  // Only set HSTS if we're on HTTPS (don't set for localhost)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    );
  }

  // Restrict browser features — only allow what the app needs
  // microphone: needed for speaking test (Web Speech API)
  // camera: not needed
  // geolocation: not needed
  response.headers.set(
    'Permissions-Policy',
    'camera=(), geolocation=(), microphone=(self), payment=(self)'
  );

  // Content Security Policy — whitelist sources for content loading
  // Development is more permissive; production is strict
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.paypal.com https://www.sandbox.paypal.com https://www.paypalobjects.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: blob: https://www.paypal.com https://www.sandbox.paypal.com https://www.paypalobjects.com",
        "frame-src https://www.paypal.com https://www.sandbox.paypal.com",
        "connect-src 'self' https://api-m.paypal.com https://api-m.sandbox.paypal.com https://generativelanguage.googleapis.com",
        "worker-src 'self' blob:",
        "report-uri /api/csp-report",
      ].join('; ')
    );
  }

  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes and static files
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/') || pathname.includes('.')) {
    const response = NextResponse.next();
    addSecurityHeaders(response);
    return response;
  }

  // Read auth token from HttpOnly cookie and VERIFY the JWT
  const accessToken = request.cookies.get('access_token')?.value;
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
    const response = NextResponse.redirect(loginUrl);
    addSecurityHeaders(response);
    return response;
  }

  // Admin route without admin role → redirect to dashboard
  if (isAdminRoute && (!tokenPayload || userRole !== 'admin')) {
    if (!tokenPayload) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      addSecurityHeaders(response);
      return response;
    }
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    addSecurityHeaders(response);
    return response;
  }

  // Auth route with valid auth → redirect to dashboard
  if (isAuthRoute && tokenPayload) {
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    addSecurityHeaders(response);
    return response;
  }

  const response = NextResponse.next();
  addSecurityHeaders(response);
  return response;
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
