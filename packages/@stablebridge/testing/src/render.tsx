import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';

function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

function AllProviders({ children }: { readonly children: ReactNode }) {
  const queryClient = createTestQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>): RenderResult {
  return render(ui, { wrapper: AllProviders, ...options });
}

export { customRender as render, createTestQueryClient };
