import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Always allow Next.js internals, API routes, static files with extensions, and favicon
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const userToken = req.cookies.get('stakelab_token')?.value || req.cookies.get('sec-prd-token')?.value;

  // Auth routes that logged-in users shouldn't re-visit
  const isAuthRoute =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password' ||
    pathname === '/verify-otp';

  // Prevent logged-in users from visiting auth pages (/login, /register, etc.)
  if (isAuthRoute && userToken) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // List of public paths that don't require authentication
  const isPublicPath =
    pathname === '/' ||
    isAuthRoute;

  // Protect all non-public routes
  if (!isPublicPath && !userToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
