import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { DataResponse } from '@stablebridge/types';
import { useApiClient } from '../provider';
import { userKeys } from '../keys/users';

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  scopes?: string[];
  active: boolean;
  lastUsedAt?: string;
  expiresAt?: string;
  createdAt: string;
}

interface ApiKeyCreated {
  id: string;
  name: string;
  rawKey: string;
  prefix: string;
  createdAt: string;
}

export function useApiKeys(merchantId: string) {
  const client = useApiClient();

  return useQuery({
    queryKey: userKeys.apiKeys(merchantId),
    queryFn: ({ signal }) =>
      client
        .get<DataResponse<ApiKey[]>>(
          `/merchants/${merchantId}/api-keys`,
          { signal },
        )
        .then((r) => r.data),
  });
}

interface CreateApiKeyRequest {
  name: string;
  environment?: string;
  scopes?: string[];
  allowedIps?: string[];
  expiresInSeconds?: number;
}

export function useCreateApiKey(merchantId: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateApiKeyRequest) =>
      client
        .post<DataResponse<ApiKeyCreated>>(
          `/merchants/${merchantId}/api-keys`,
          { body: { ...data, merchantId } },
        )
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.apiKeys(merchantId) });
    },
  });
}

export function useRevokeApiKey(merchantId: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (keyId: string) =>
      client.delete<void>(`/merchants/${merchantId}/api-keys/${keyId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.apiKeys(merchantId) });
    },
  });
}
