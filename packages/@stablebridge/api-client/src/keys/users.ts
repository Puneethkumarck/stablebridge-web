import type { Role } from '@stablebridge/types';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (
    merchantId: string,
    filters?: { role?: Role; active?: boolean; page?: number; size?: number },
  ) => [...userKeys.lists(), merchantId, filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (merchantId: string, userId: string) =>
    [...userKeys.details(), merchantId, userId] as const,
  roles: (merchantId: string) => [...userKeys.all, 'roles', merchantId] as const,
  apiKeys: (merchantId: string) => [...userKeys.all, 'api-keys', merchantId] as const,
  oauthClients: (merchantId: string) =>
    [...userKeys.all, 'oauth-clients', merchantId] as const,
} as const;
