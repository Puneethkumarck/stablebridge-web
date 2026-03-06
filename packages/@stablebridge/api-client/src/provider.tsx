import { createContext, use, useMemo, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createApiClient, type ApiClient } from './client';

const ApiClientContext = createContext<ApiClient | null>(null);

const DEFAULT_QUERY_CLIENT = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: (failureCount, error) => {
        // Don't retry on auth errors
        if (error instanceof Error && 'status' in error) {
          const status = (error as { status: number }).status;
          if (status === 401 || status === 403) return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

interface ApiProviderProps {
  children: ReactNode;
  baseUrl?: string;
  queryClient?: QueryClient;
  getAccessToken?: (() => string | null) | undefined;
}

export function ApiProvider({
  children,
  baseUrl = '/api',
  queryClient = DEFAULT_QUERY_CLIENT,
  getAccessToken,
}: ApiProviderProps) {
  const client = useMemo(
    () => createApiClient({ baseUrl, getAccessToken }),
    [baseUrl, getAccessToken],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ApiClientContext value={client}>{children}</ApiClientContext>
    </QueryClientProvider>
  );
}

export function useApiClient(): ApiClient {
  const client = use(ApiClientContext);
  if (!client) {
    throw new Error('useApiClient must be used within an <ApiProvider>');
  }
  return client;
}
