'use client';

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AuthUser } from '@stablebridge/types';

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  mfaRequired: boolean;
  mfaToken: string | null;
}

export interface AuthContextValue extends AuthState {
  setUser: (user: AuthUser) => void;
  setMfaRequired: (mfaToken: string) => void;
  clearAuth: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  readonly children: ReactNode;
  readonly initialUser?: AuthUser | null;
}

export function AuthProvider({
  children,
  initialUser = null,
}: AuthProviderProps) {
  const [user, setUserState] = useState<AuthUser | null>(initialUser);
  const [isLoading, setIsLoading] = useState(!initialUser);
  const [mfaRequired, setMfaRequiredState] = useState(false);
  const [mfaToken, setMfaToken] = useState<string | null>(null);

  const setUser = useCallback((newUser: AuthUser) => {
    setUserState(newUser);
    setIsLoading(false);
    setMfaRequiredState(false);
    setMfaToken(null);
  }, []);

  const setMfaRequired = useCallback((token: string) => {
    setMfaRequiredState(true);
    setMfaToken(token);
    setIsLoading(false);
  }, []);

  const clearAuth = useCallback(() => {
    setUserState(null);
    setIsLoading(false);
    setMfaRequiredState(false);
    setMfaToken(null);
  }, []);

  // Fetch current user on mount if no initial user
  useEffect(() => {
    if (initialUser) return;

    let cancelled = false;
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const { data } = await res.json();
          if (!cancelled) setUser(data);
        } else {
          if (!cancelled) setIsLoading(false);
        }
      } catch {
        if (!cancelled) setIsLoading(false);
      }
    }
    fetchUser();
    return () => {
      cancelled = true;
    };
  }, [initialUser, setUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      mfaRequired,
      mfaToken,
      setUser,
      setMfaRequired,
      clearAuth,
    }),
    [user, isLoading, mfaRequired, mfaToken, setUser, setMfaRequired, clearAuth],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
