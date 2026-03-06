import { useMutation, useQuery } from '@tanstack/react-query';
import type { AuthUser, DataResponse, Role } from '@stablebridge/types';
import { useApiClient } from '../provider';

interface Invitation {
  email: string;
  merchantName: string;
  role: Role;
  expiresAt: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  mfaRequired: boolean;
}

export function useInvitation(token: string) {
  const client = useApiClient();

  return useQuery({
    queryKey: ['invitations', token],
    queryFn: ({ signal }) =>
      client
        .get<DataResponse<Invitation>>(`/iam/v1/invitations/${token}`, { signal })
        .then((r) => r.data),
    retry: false,
  });
}

interface AcceptInvitationRequest {
  password: string;
  firstName?: string;
  lastName?: string;
  termsAccepted: boolean;
}

export function useAcceptInvitation(token: string) {
  const client = useApiClient();

  return useMutation({
    mutationFn: (data: AcceptInvitationRequest) =>
      client.post<DataResponse<LoginResponse>>(
        `/invitations/${token}/accept`,
        { body: data },
      ),
  });
}
