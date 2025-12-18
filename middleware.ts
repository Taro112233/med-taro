// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth');
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // If on public route, allow access
  if (isPublicRoute) {
    // If already authenticated and trying to access login, redirect to dashboard
    if (pathname === '/login' && authCookie) {
      try {
        const auth = JSON.parse(authCookie.value);
        if (auth.authenticated) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      } catch {
        // Invalid cookie, allow access to login
      }
    }
    return NextResponse.next();
  }

  // Protected routes - check authentication
  if (!authCookie) {
    // Not authenticated, redirect to login
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  try {
    const auth = JSON.parse(authCookie.value);
    
    // Check if authenticated
    if (!auth.authenticated) {
      const url = new URL('/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }

    // Check if cookie is expired (8 hours)
    const cookieAge = Date.now() - (auth.timestamp || 0);
    const maxAge = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
    
    if (cookieAge > maxAge) {
      // Cookie expired, redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth');
      return response;
    }

    // Authentication valid, allow access
    return NextResponse.next();
  } catch {
    // Invalid cookie format, redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
  ],
};