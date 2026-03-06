'use client';

import { useCallback } from 'react';
import type { Permission } from '@stablebridge/types';
import { useAuth } from './use-auth';

export function usePermission() {
  const { user } = useAuth();

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!user) return false;
      return user.permissions.includes(permission);
    },
    [user],
  );

  const hasAnyPermission = useCallback(
    (permissions: readonly Permission[]): boolean => {
      if (!user) return false;
      return permissions.some((p) => user.permissions.includes(p));
    },
    [user],
  );

  const hasAllPermissions = useCallback(
    (permissions: readonly Permission[]): boolean => {
      if (!user) return false;
      return permissions.every((p) => user.permissions.includes(p));
    },
    [user],
  );

  return { hasPermission, hasAnyPermission, hasAllPermissions };
}
