import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware — Route Protection
 *
 * Reads the accessToken cookie to determine auth state.
 * This is a client-side presence check only — real verification happens on the API.
 * If cookie is present, we let the request through.
 * React Query's useAuth will do the real validation and redirect if cookie is invalid.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const isAuthRoute = pathname.startsWith('/auth');
  const isDashboardRoute = pathname.startsWith('/dashboard');

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && accessToken && !pathname.includes('registration-success')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users from protected pages
  if (isDashboardRoute && !accessToken) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files, API routes, Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
