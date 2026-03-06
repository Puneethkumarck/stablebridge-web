import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  DataResponse,
  Merchant,
  MerchantStatus,
  MerchantSummary,
  PageResponse,
} from '@stablebridge/types';
import { useApiClient } from '../provider';
import { merchantKeys } from '../keys/merchants';

interface ListMerchantsParams {
  status?: MerchantStatus;
  search?: string;
  countryCode?: string;
  page?: number;
  size?: number;
}

export function useMerchants(params?: ListMerchantsParams) {
  const client = useApiClient();

  return useQuery({
    queryKey: merchantKeys.list(params),
    queryFn: ({ signal }) =>
      client.get<PageResponse<MerchantSummary>>('/merchants', {
        ...(params ? { params: params as Record<string, string | number | boolean | undefined> } : {}),
        signal,
      }),
  });
}

export function useMerchant(merchantId: string) {
  const client = useApiClient();

  return useQuery({
    queryKey: merchantKeys.detail(merchantId),
    queryFn: ({ signal }) =>
      client
        .get<DataResponse<Merchant>>(`/merchants/${merchantId}`, { signal })
        .then((r) => r.data),
  });
}

interface UpdateMerchantRequest {
  tradingName?: string;
  primaryContactEmail?: string;
  primaryContactName?: string;
  website?: string;
}

export function useUpdateMerchant(merchantId: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMerchantRequest) =>
      client
        .patch<DataResponse<Merchant>>(`/merchants/${merchantId}`, {
          body: data,
        })
        .then((r) => r.data),
    onSuccess: (merchant) => {
      queryClient.setQueryData(merchantKeys.detail(merchantId), merchant);
      queryClient.invalidateQueries({ queryKey: merchantKeys.lists() });
    },
  });
}

export function useActivateMerchant() {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (merchantId: string) =>
      client
        .post<DataResponse<Merchant>>(`/merchants/${merchantId}/activate`)
        .then((r) => r.data),
    onSuccess: (merchant) => {
      queryClient.setQueryData(merchantKeys.detail(merchant.id), merchant);
      queryClient.invalidateQueries({ queryKey: merchantKeys.lists() });
    },
  });
}

export function useSuspendMerchant() {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ merchantId, reason }: { merchantId: string; reason?: string }) =>
      client
        .post<DataResponse<Merchant>>(`/merchants/${merchantId}/suspend`, {
          body: reason ? { reason } : undefined,
        })
        .then((r) => r.data),
    onSuccess: (merchant) => {
      queryClient.setQueryData(merchantKeys.detail(merchant.id), merchant);
      queryClient.invalidateQueries({ queryKey: merchantKeys.lists() });
    },
  });
}

export function useReactivateMerchant() {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (merchantId: string) =>
      client
        .post<DataResponse<Merchant>>(`/merchants/${merchantId}/reactivate`)
        .then((r) => r.data),
    onSuccess: (merchant) => {
      queryClient.setQueryData(merchantKeys.detail(merchant.id), merchant);
      queryClient.invalidateQueries({ queryKey: merchantKeys.lists() });
    },
  });
}

export function useCloseMerchant() {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ merchantId, reason }: { merchantId: string; reason?: string }) =>
      client
        .post<DataResponse<Merchant>>(`/merchants/${merchantId}/close`, {
          body: reason ? { reason } : undefined,
        })
        .then((r) => r.data),
    onSuccess: (merchant) => {
      queryClient.setQueryData(merchantKeys.detail(merchant.id), merchant);
      queryClient.invalidateQueries({ queryKey: merchantKeys.lists() });
    },
  });
}

interface KybEvent {
  status: MerchantStatus;
  timestamp: string;
  note?: string;
  performedBy?: string;
}

interface KybStatus {
  currentStatus: MerchantStatus;
  timeline: KybEvent[];
}

export function useMerchantKybStatus(merchantId: string) {
  const client = useApiClient();

  return useQuery({
    queryKey: merchantKeys.kybStatus(merchantId),
    queryFn: ({ signal }) =>
      client
        .get<DataResponse<KybStatus>>(
          `/merchants/${merchantId}/kyb-status`,
          { signal },
        )
        .then((r) => r.data),
  });
}
