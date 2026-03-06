import type { MerchantStatus } from '@stablebridge/types';

export const merchantKeys = {
  all: ['merchants'] as const,
  lists: () => [...merchantKeys.all, 'list'] as const,
  list: (filters?: { status?: MerchantStatus; search?: string; page?: number; size?: number }) =>
    [...merchantKeys.lists(), filters] as const,
  details: () => [...merchantKeys.all, 'detail'] as const,
  detail: (id: string) => [...merchantKeys.details(), id] as const,
  kybStatus: (id: string) => [...merchantKeys.detail(id), 'kyb-status'] as const,
} as const;
