import { NextResponse, type NextRequest } from 'next/server';
import {
  verifyAuthToken,
  isPublicRoute,
  hasRoutePermission,
} from '@stablebridge/auth/middleware';
import { ACCESS_TOKEN_COOKIE } from '@stablebridge/auth';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-in-production';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes and static files
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  // Public routes — redirect to dashboard if already authenticated
  if (isPublicRoute(pathname)) {
    if (token) {
      const payload = await verifyAuthToken(token, JWT_SECRET);
      if (payload) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
    return NextResponse.next();
  }

  // Protected routes — redirect to login if not authenticated
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = await verifyAuthToken(token, JWT_SECRET);

  if (!payload) {
    // Token expired or invalid — try refresh
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(ACCESS_TOKEN_COOKIE);
    return response;
  }

  // MFA enforcement
  if (!payload.mfa_verified && payload.role === 'ADMIN' && !pathname.startsWith('/mfa')) {
    return NextResponse.redirect(new URL('/mfa/verify', request.url));
  }

  // RBAC check
  if (!hasRoutePermission(payload.permissions, pathname)) {
    return NextResponse.redirect(new URL('/?error=forbidden', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes (handled separately)
     * - _next (static files)
     * - favicon, images, etc.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
