export const ACCESS_TOKEN_COOKIE = 'sb_access_token';
export const REFRESH_TOKEN_COOKIE = 'sb_refresh_token';
export const ACCESS_TOKEN_MAX_AGE = 3600; // 1 hour
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 3600; // 7 days
export const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export const PUBLIC_ROUTES = [
  '/login',
  '/forgot-password',
  '/reset-password',
  '/invitations',
] as const;

export const ROUTE_PERMISSIONS: Record<string, string> = {
  '/team': 'users:read',
  '/team/invite': 'users:write',
  '/settings': 'settings:read',
  '/settings/api-keys': 'settings:write',
  '/settings/oauth-clients': 'settings:write',
};
