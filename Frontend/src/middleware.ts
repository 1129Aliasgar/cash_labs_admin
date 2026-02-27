import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJwt } from 'jose';

interface DecodedToken {
  userId: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MERCHANT' | 'AGENT';
  isVerified: boolean;
}

/**
 * Next.js Middleware — Route Protection & RBAC
 *
 * Reads the accessToken cookie. If present, decodes it to get the user's role.
 * Redirects users to their respective dashboards based on role.
 * NOTE: Merchant status is NOT in the JWT (per spec).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;

  const isAuthRoute = pathname.startsWith('/auth');
  const isPublicRoute = isAuthRoute || pathname === '/' || pathname === '/favicon.ico';

  // 1. Guard: Redirect unauthenticated users from protected routes
  if (!accessToken && !isPublicRoute) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // NOTE: Redirection is strictly controlled by the AuthGate (AuthProvider).
  // Do NOT add role/status logic here.
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files, Next.js internals, and API
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
