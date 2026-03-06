'use client';

import type { ReactNode } from 'react';
import { AuthProvider } from '@stablebridge/auth';
import { ApiProvider } from '@stablebridge/api-client';

export function Providers({ children }: { readonly children: ReactNode }) {
  return (
    <AuthProvider>
      <ApiProvider>{children}</ApiProvider>
    </AuthProvider>
  );
}
