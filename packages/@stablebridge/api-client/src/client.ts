import type { ApiError } from '@stablebridge/types';
import { generateIdempotencyKey } from '@stablebridge/utils';

export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: readonly string[] | undefined;
  readonly traceId: string | undefined;

  constructor(status: number, error: ApiError) {
    super(error.message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = error.code;
    this.details = error.details;
    this.traceId = error.traceId;
  }
}

const ERROR_CODE_MESSAGES: Record<string, string> = {
  'IAM-0001': 'Invalid email or password.',
  'IAM-0002': 'Account is locked. Please contact support.',
  'IAM-0003': 'Account is suspended.',
  'IAM-0010': 'Invalid credentials.',
  'IAM-0020': 'Invalid MFA code. Please try again.',
  'IAM-0030': 'Invitation has expired.',
  'IAM-0031': 'Invitation has already been accepted.',
  'IAM-0040': 'User already exists for this merchant.',
  'IAM-0050': 'Insufficient permissions.',
  'MO-0001': 'Merchant not found.',
  'MO-0002': 'Merchant is not in a valid state for this action.',
  'MO-0003': 'Merchant already exists with this registration number.',
  'GW-1001': 'Request rate limit exceeded. Please wait and try again.',
  'GW-2001': 'Service temporarily unavailable. Please try again later.',
};

function mapErrorMessage(error: ApiError): ApiError {
  const mappedMessage = ERROR_CODE_MESSAGES[error.code];
  if (mappedMessage) {
    return { ...error, message: mappedMessage };
  }
  return error;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const MUTATING_METHODS = new Set<HttpMethod>(['POST', 'PATCH', 'PUT', 'DELETE']);

interface ApiClientConfig {
  baseUrl: string;
  getAccessToken: (() => string | null) | undefined;
}

export function createApiClient(config: ApiClientConfig) {
  async function request<T>(
    method: HttpMethod,
    path: string,
    options?: {
      body?: unknown;
      params?: Record<string, string | number | boolean | undefined>;
      headers?: Record<string, string>;
      signal?: AbortSignal;
    },
  ): Promise<T> {
    const url = new URL(path, config.baseUrl);

    if (options?.params) {
      for (const [key, value] of Object.entries(options.params)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options?.headers,
    };

    // Auth interceptor
    const token = config.getAccessToken?.();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Idempotency interceptor — auto-add for mutating requests
    if (MUTATING_METHODS.has(method) && !headers['Idempotency-Key']) {
      headers['Idempotency-Key'] = generateIdempotencyKey();
    }

    const fetchInit: RequestInit = {
      method,
      headers,
      credentials: 'include',
    };
    if (options?.body) {
      fetchInit.body = JSON.stringify(options.body);
    }
    if (options?.signal) {
      fetchInit.signal = options.signal;
    }

    const response = await fetch(url.toString(), fetchInit);

    if (response.status === 204) {
      return undefined as T;
    }

    if (!response.ok) {
      let errorBody: ApiError;
      try {
        errorBody = mapErrorMessage(await response.json());
      } catch {
        errorBody = {
          code: 'UNKNOWN',
          message: 'An unexpected error occurred. Please try again.',
          timestamp: new Date().toISOString(),
        };
      }
      throw new ApiClientError(response.status, errorBody);
    }

    return response.json() as Promise<T>;
  }

  return {
    get: <T>(path: string, options?: Parameters<typeof request>[2]) =>
      request<T>('GET', path, options),

    post: <T>(path: string, options?: Parameters<typeof request>[2]) =>
      request<T>('POST', path, options),

    patch: <T>(path: string, options?: Parameters<typeof request>[2]) =>
      request<T>('PATCH', path, options),

    put: <T>(path: string, options?: Parameters<typeof request>[2]) =>
      request<T>('PUT', path, options),

    delete: <T>(path: string, options?: Parameters<typeof request>[2]) =>
      request<T>('DELETE', path, options),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
