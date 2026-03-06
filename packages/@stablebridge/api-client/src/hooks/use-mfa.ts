import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AuthUser, DataResponse } from '@stablebridge/types';
import { useApiClient } from '../provider';
import { authKeys } from '../keys/auth';

interface MfaSetupResponse {
  secret: string;
  provisioningUri: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  mfaRequired?: boolean;
}

export function useSetupMfa(merchantId: string) {
  const client = useApiClient();

  return useMutation({
    mutationFn: () =>
      client
        // TODO: Backend spec requires userId — /iam/v1/merchants/{mid}/users/{uid}/mfa/setup
        .post<DataResponse<MfaSetupResponse>>(`/iam/v1/merchants/${merchantId}/auth/mfa/setup`)
        .then((r) => r.data),
  });
}

export function useVerifyMfa(merchantId: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { totpCode: string; mfaChallengeId?: string }) =>
      client.post<DataResponse<LoginResponse>>(
        `/iam/v1/merchants/${merchantId}/auth/mfa/verify`,
        { body: data },
      ),
    onSuccess: (response) => {
      queryClient.setQueryData(authKeys.me(), response.data.user);
    },
  });
}
