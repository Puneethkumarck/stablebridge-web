import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { DataResponse, PageResponse } from '@stablebridge/types';
import { useApiClient } from '../provider';
import { userKeys } from '../keys/users';

export interface RoleResponse {
  roleId: string;
  roleName: string;
  description: string | undefined;
  builtin: boolean;
  active: boolean;
  userCount: number;
  permissions: string[];
  createdAt: string | undefined;
  updatedAt: string | undefined;
}

export function useRoles(merchantId: string) {
  const client = useApiClient();

  return useQuery({
    queryKey: userKeys.roles(merchantId),
    queryFn: ({ signal }) =>
      client.get<PageResponse<RoleResponse>>(
        `/merchants/${merchantId}/roles`,
        { signal },
      ),
  });
}

interface CreateRoleRequest {
  roleName: string;
  description?: string;
  permissions: string[];
}

export function useCreateRole(merchantId: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleRequest) =>
      client
        .post<DataResponse<RoleResponse>>(
          `/merchants/${merchantId}/roles`,
          { body: data },
        )
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.roles(merchantId) });
    },
  });
}

interface UpdateRoleRequest {
  permissions: string[];
}

export function useUpdateRole(merchantId: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, ...data }: UpdateRoleRequest & { roleId: string }) =>
      client
        .patch<DataResponse<RoleResponse>>(
          `/merchants/${merchantId}/roles/${roleId}`,
          { body: data },
        )
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.roles(merchantId) });
    },
  });
}

export function useDeleteRole(merchantId: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleId: string) =>
      client.delete<void>(`/merchants/${merchantId}/roles/${roleId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.roles(merchantId) });
    },
  });
}
