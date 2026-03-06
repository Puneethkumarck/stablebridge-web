import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  ApprovedCorridor,
  DataResponse,
  KybVerification,
  Merchant,
  MerchantStatus,
  MerchantSummary,
  PageResponse,
} from '@stablebridge/types';
import { useApiClient } from '../provider';
import { merchantKeys } from '../keys/merchants';

/* ------------------------------------------------------------------ */
/*  List / Get                                                         */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Update                                                             */
/* ------------------------------------------------------------------ */

interface UpdateMerchantRequest {
  tradingName?: string;
  websiteUrl?: string;
  registeredAddress?: {
    streetLine1?: string;
    streetLine2?: string;
    city?: string;
    stateProvince?: string;
    postcode?: string;
    country?: string;
  };
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

/* ------------------------------------------------------------------ */
/*  Lifecycle actions                                                  */
/* ------------------------------------------------------------------ */

interface ActivateMerchantRequest {
  approvedBy: string;
  scopes?: string[];
}

export function useActivateMerchant() {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ merchantId, ...data }: ActivateMerchantRequest & { merchantId: string }) =>
      client
        .post<DataResponse<Merchant>>(`/merchants/${merchantId}/activate`, {
          body: data,
        })
        .then((r) => r.data),
    onSuccess: (merchant) => {
      queryClient.setQueryData(merchantKeys.detail(merchant.merchantId), merchant);
      queryClient.invalidateQueries({ queryKey: merchantKeys.lists() });
    },
  });
}

interface SuspendMerchantRequest {
  merchantId: string;
  reason?: string;
  suspendedBy?: string;
}

export function useSuspendMerchant() {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ merchantId, ...body }: SuspendMerchantRequest) =>
      client.post<void>(`/merchants/${merchantId}/suspend`, {
        body,
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: merchantKeys.detail(variables.merchantId) });
      queryClient.invalidateQueries({ queryKey: merchantKeys.lists() });
    },
  });
}

export function useReactivateMerchant() {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (merchantId: string) =>
      client.post<void>(`/merchants/${merchantId}/reactivate`),
    onSuccess: (_data, merchantId) => {
      queryClient.invalidateQueries({ queryKey: merchantKeys.detail(merchantId) });
      queryClient.invalidateQueries({ queryKey: merchantKeys.lists() });
    },
  });
}

interface CloseMerchantRequest {
  merchantId: string;
  reason?: string;
  closedBy?: string;
}

export function useCloseMerchant() {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ merchantId, ...body }: CloseMerchantRequest) =>
      client.post<void>(`/merchants/${merchantId}/close`, {
        body,
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: merchantKeys.detail(variables.merchantId) });
      queryClient.invalidateQueries({ queryKey: merchantKeys.lists() });
    },
  });
}

/* ------------------------------------------------------------------ */
/*  KYB                                                                */
/* ------------------------------------------------------------------ */

export function useStartKyb() {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (merchantId: string) =>
      client.post<void>(`/merchants/${merchantId}/kyb/start`),
    onSuccess: (_data, merchantId) => {
      queryClient.invalidateQueries({ queryKey: merchantKeys.detail(merchantId) });
      queryClient.invalidateQueries({ queryKey: merchantKeys.kybStatus(merchantId) });
    },
  });
}

export function useMerchantKybStatus(merchantId: string) {
  const client = useApiClient();

  return useQuery({
    queryKey: merchantKeys.kybStatus(merchantId),
    queryFn: ({ signal }) =>
      client
        .get<DataResponse<KybVerification>>(
          `/merchants/${merchantId}/kyb`,
          { signal },
        )
        .then((r) => r.data),
  });
}

/* ------------------------------------------------------------------ */
/*  Corridors                                                          */
/* ------------------------------------------------------------------ */

interface ApproveCorridorRequest {
  sourceCountry: string;
  targetCountry: string;
  currencies: string[];
  maxAmountUsd: number;
  expiresAt: string;
}

export function useApproveCorridor(merchantId: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ approvedBy, ...data }: ApproveCorridorRequest & { approvedBy: string }) =>
      client
        .post<DataResponse<ApprovedCorridor>>(`/merchants/${merchantId}/corridors`, {
          body: data,
          headers: { 'X-Approved-By': approvedBy },
        })
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: merchantKeys.detail(merchantId) });
    },
  });
}

/* ------------------------------------------------------------------ */
/*  Documents                                                          */
/* ------------------------------------------------------------------ */

interface DocumentUploadRequest {
  documentType: string;
  fileName: string;
}

interface DocumentUploadResponse {
  uploadUrl: string;
  expiresAt: string;
}

export function useUploadDocument(merchantId: string) {
  const client = useApiClient();

  return useMutation({
    mutationFn: (data: DocumentUploadRequest) =>
      client
        .post<DataResponse<DocumentUploadResponse>>(`/merchants/${merchantId}/documents`, {
          body: data,
        })
        .then((r) => r.data),
  });
}

/* ------------------------------------------------------------------ */
/*  Rate Limit Tier                                                    */
/* ------------------------------------------------------------------ */

interface UpdateRateLimitTierRequest {
  newTier: string;
  updatedBy: string;
}

export function useUpdateRateLimitTier(merchantId: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRateLimitTierRequest) =>
      client
        .patch<DataResponse<Merchant>>(`/merchants/${merchantId}/rate-limit-tier`, {
          body: data,
        })
        .then((r) => r.data),
    onSuccess: (merchant) => {
      queryClient.setQueryData(merchantKeys.detail(merchantId), merchant);
    },
  });
}
