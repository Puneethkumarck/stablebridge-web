import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { DataResponse, MerchantUser, PageResponse } from '@stablebridge/types';
import { useApiClient } from '../provider';
import { userKeys } from '../keys/users';

interface ListUsersParams {
  merchantId: string;
  status?: string;
  page?: number;
  size?: number;
}

export function useMerchantUsers({ merchantId, ...filters }: ListUsersParams) {
  const client = useApiClient();

  return useQuery({
    queryKey: userKeys.list(merchantId, filters),
    queryFn: ({ signal }) =>
      client.get<PageResponse<MerchantUser>>(
        `/iam/v1/merchants/${merchantId}/users`,
        { params: filters, signal },
      ),
  });
}

export function useMerchantUser(merchantId: string, userId: string) {
  const client = useApiClient();

  return useQuery({
    queryKey: userKeys.detail(merchantId, userId),
    queryFn: ({ signal }) =>
      client
        .get<DataResponse<MerchantUser>>(
          `/iam/v1/merchants/${merchantId}/users/${userId}`,
          { signal },
        )
        .then((r) => r.data),
  });
}

interface InviteUserRequest {
  email: string;
  fullName: string;
  roleId: string;
}

export function useInviteUser(merchantId: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InviteUserRequest) =>
      client
        .post<DataResponse<MerchantUser>>(
          `/iam/v1/merchants/${merchantId}/users/invite`,
          { body: data },
        )
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

interface ChangeUserRoleRequest {
  roleId: string;
}

export function useChangeUserRole(merchantId: string, userId: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChangeUserRoleRequest) =>
      client
        .patch<DataResponse<{ userId: string; roleId: string; roleName: string; merchantId: string }>>(
          `/iam/v1/merchants/${merchantId}/users/${userId}/role`,
          { body: data },
        )
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(merchantId, userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

interface SuspendUserRequest {
  reason?: string;
  suspendedBy?: string;
}

export function useSuspendUser(merchantId: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, ...body }: SuspendUserRequest & { userId: string }) =>
      client
        .post<DataResponse<{ userId: string; status: string; suspendedAt: string }>>(
          `/iam/v1/merchants/${merchantId}/users/${userId}/suspend`,
          { body },
        )
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useReactivateUser(merchantId: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      client
        .post<DataResponse<{ userId: string; status: string; activatedAt: string }>>(
          `/iam/v1/merchants/${merchantId}/users/${userId}/reactivate`,
        )
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useDeactivateUser(merchantId: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      client.delete<void>(`/iam/v1/merchants/${merchantId}/users/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
