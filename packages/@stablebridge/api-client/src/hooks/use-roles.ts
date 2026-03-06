import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { DataResponse, Permission } from '@stablebridge/types';
import { useApiClient } from '../provider';
import { userKeys } from '../keys/users';

interface RoleDetail {
  id?: string;
  name: string;
  label?: string;
  description?: string;
  permissions: Permission[];
  builtIn: boolean;
}

export function useRoles(merchantId: string) {
  const client = useApiClient();

  return useQuery({
    queryKey: userKeys.roles(merchantId),
    queryFn: ({ signal }) =>
      client
        .get<DataResponse<RoleDetail[]>>(
          `/merchants/${merchantId}/roles`,
          { signal },
        )
        .then((r) => r.data),
  });
}

interface CreateRoleRequest {
  name: string;
  label?: string;
  description?: string;
  permissions: Permission[];
}

export function useCreateRole(merchantId: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleRequest) =>
      client
        .post<DataResponse<RoleDetail>>(
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
  label?: string;
  description?: string;
  permissions?: Permission[];
}

export function useUpdateRole(merchantId: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, ...data }: UpdateRoleRequest & { roleId: string }) =>
      client
        .patch<DataResponse<RoleDetail>>(
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
