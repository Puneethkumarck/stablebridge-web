import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { DataResponse } from '@stablebridge/types';
import { useApiClient } from '../provider';
import { userKeys } from '../keys/users';

interface OAuthClient {
  id: string;
  clientId: string;
  name: string;
  scopes?: string[];
  grantTypes?: string[];
  active: boolean;
  createdAt: string;
}

interface OAuthClientCreated {
  id: string;
  clientId: string;
  clientSecret: string;
  name: string;
  scopes?: string[];
  grantTypes?: string[];
  createdAt: string;
}

export function useOAuthClients(merchantId: string) {
  const client = useApiClient();

  return useQuery({
    queryKey: userKeys.oauthClients(merchantId),
    queryFn: ({ signal }) =>
      client
        .get<DataResponse<OAuthClient[]>>(
          `/gateway/v1/merchants/${merchantId}/oauth-clients`,
          { signal },
        )
        .then((r) => r.data),
  });
}

interface CreateOAuthClientRequest {
  name: string;
  scopes?: string[];
  grantTypes?: string[];
}

export function useCreateOAuthClient(merchantId: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOAuthClientRequest) =>
      client
        .post<DataResponse<OAuthClientCreated>>(
          `/gateway/v1/merchants/${merchantId}/oauth-clients`,
          { body: data },
        )
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.oauthClients(merchantId),
      });
    },
  });
}
