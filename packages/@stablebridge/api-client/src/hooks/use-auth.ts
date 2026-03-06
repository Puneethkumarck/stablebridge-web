import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AuthUser, DataResponse } from '@stablebridge/types';
import { useApiClient } from '../provider';
import { authKeys } from '../keys/auth';

interface LoginRequest {
  email: string;
  password: string;
  merchantId: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  mfaRequired?: boolean;
  mfaToken?: string;
}

export function useLogin() {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) =>
      client.post<DataResponse<LoginResponse>>(
        `/iam/v1/merchants/${data.merchantId}/auth/login`,
        { body: { email: data.email, password: data.password } },
      ),
    onSuccess: (response) => {
      if (!response.data.mfaRequired) {
        queryClient.setQueryData(authKeys.me(), response.data.user);
      }
    },
  });
}

export function useLogout() {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => client.post<void>('/iam/v1/auth/logout'),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useCurrentUser(enabled = true) {
  const client = useApiClient();

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: ({ signal }) =>
      client
        .get<DataResponse<AuthUser>>('/iam/v1/auth/me', { signal })
        .then((r) => r.data),
    enabled,
    staleTime: 5 * 60_000,
  });
}

export function useForgotPassword() {
  const client = useApiClient();

  return useMutation({
    mutationFn: ({ merchantId, email }: { merchantId: string; email: string }) =>
      client.post<void>(`/iam/v1/merchants/${merchantId}/auth/forgot-password`, {
        body: { email },
      }),
  });
}

export function useResetPassword() {
  const client = useApiClient();

  return useMutation({
    mutationFn: ({ merchantId, ...data }: { merchantId: string; token: string; newPassword: string }) =>
      client.post<void>(`/iam/v1/merchants/${merchantId}/auth/reset-password`, {
        body: data,
      }),
  });
}
