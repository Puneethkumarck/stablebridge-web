import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AuthUser, DataResponse } from '@stablebridge/types';
import { useApiClient } from '../provider';
import { authKeys } from '../keys/auth';

interface LoginRequest {
  email: string;
  password: string;
  merchantId?: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  mfaRequired: boolean;
  mfaToken?: string;
}

export function useLogin() {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) =>
      client.post<DataResponse<LoginResponse>>('/auth/login', { body: data }),
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
    mutationFn: () => client.post<void>('/auth/logout'),
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
        .get<DataResponse<AuthUser>>('/auth/me', { signal })
        .then((r) => r.data),
    enabled,
    staleTime: 5 * 60_000,
  });
}

export function useForgotPassword() {
  const client = useApiClient();

  return useMutation({
    mutationFn: (email: string) =>
      client.post<void>('/auth/forgot-password', { body: { email } }),
  });
}

export function useResetPassword() {
  const client = useApiClient();

  return useMutation({
    mutationFn: (data: { token: string; newPassword: string }) =>
      client.post<void>('/auth/reset-password', { body: data }),
  });
}
