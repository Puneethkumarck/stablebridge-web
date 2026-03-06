'use client';

import { use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext, type AuthContextValue } from './auth-provider';

export function useAuth(): AuthContextValue {
  const context = use(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return context;
}

export function useLogout() {
  const { clearAuth } = useAuth();
  const router = useRouter();

  return useCallback(async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    clearAuth();
    router.push('/login');
  }, [clearAuth, router]);
}
