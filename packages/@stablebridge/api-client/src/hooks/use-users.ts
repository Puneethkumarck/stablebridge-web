import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { DataResponse, MerchantUser, PageResponse, Role } from '@stablebridge/types';
import { useApiClient } from '../provider';
import { userKeys } from '../keys/users';

interface ListUsersParams {
  merchantId: string;
  role?: Role;
  active?: boolean;
  page?: number;
  size?: number;
}

export function useMerchantUsers({ merchantId, ...filters }: ListUsersParams) {
  const client = useApiClient();

  return useQuery({
    queryKey: userKeys.list(merchantId, filters),
    queryFn: ({ signal }) =>
      client.get<PageResponse<MerchantUser>>(
        `/merchants/${merchantId}/users`,
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
          `/merchants/${merchantId}/users/${userId}`,
          { signal },
        )
        .then((r) => r.data),
  });
}

interface InviteUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export function useInviteUser(merchantId: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InviteUserRequest) =>
      client
        .post<DataResponse<MerchantUser>>(
          `/merchants/${merchantId}/users`,
          { body: data },
        )
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

interface UpdateUserRequest {
  role?: Role;
  active?: boolean;
}

export function useUpdateUser(merchantId: string, userId: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) =>
      client
        .patch<DataResponse<MerchantUser>>(
          `/merchants/${merchantId}/users/${userId}`,
          { body: data },
        )
        .then((r) => r.data),
    onSuccess: (user) => {
      queryClient.setQueryData(userKeys.detail(merchantId, userId), user);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useSuspendUser(merchantId: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      client
        .post<DataResponse<MerchantUser>>(
          `/merchants/${merchantId}/users/${userId}/suspend`,
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
        .post<DataResponse<MerchantUser>>(
          `/merchants/${merchantId}/users/${userId}/reactivate`,
        )
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
