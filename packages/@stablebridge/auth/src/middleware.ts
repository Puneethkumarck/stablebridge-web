import { jwtVerify, type JWTPayload } from 'jose';
import { PUBLIC_ROUTES, ROUTE_PERMISSIONS } from './constants';

interface TokenPayload extends JWTPayload {
  sub: string;
  merchantId: string;
  role: string;
  permissions: string[];
  mfa_verified: boolean;
}

export interface AuthMiddlewareConfig {
  jwtSecret: string;
  loginPath?: string;
  mfaPath?: string;
  dashboardPath?: string;
}

export async function verifyAuthToken(
  token: string,
  secret: string,
): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
    );
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

export function getRequiredPermission(pathname: string): string | undefined {
  // Check exact match first, then prefix matches (longest first)
  if (ROUTE_PERMISSIONS[pathname]) {
    return ROUTE_PERMISSIONS[pathname];
  }

  const sortedRoutes = Object.keys(ROUTE_PERMISSIONS).sort(
    (a, b) => b.length - a.length,
  );

  for (const route of sortedRoutes) {
    if (pathname.startsWith(route)) {
      return ROUTE_PERMISSIONS[route];
    }
  }

  return undefined;
}

export function hasRoutePermission(
  permissions: string[],
  pathname: string,
): boolean {
  const required = getRequiredPermission(pathname);
  if (!required) return true; // No permission required
  return permissions.includes(required);
}
