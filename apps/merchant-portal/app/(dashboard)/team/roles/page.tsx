'use client';

import { useState } from 'react';
import { useAuth } from '@stablebridge/auth';
import { useRoles } from '@stablebridge/api-client/hooks';
import type { Permission } from '@stablebridge/types';
import { PageHeader } from '@stablebridge/ui/layouts/page-header';
import { Button } from '@stablebridge/ui/components/button';
import { Badge } from '@stablebridge/ui/components/badge';
import { Spinner } from '@stablebridge/ui/components/spinner';
import { CreateRoleDialog } from './create-role-dialog';

const PERMISSION_GROUPS: { label: string; permissions: { value: Permission; label: string }[] }[] = [
  {
    label: 'Payments',
    permissions: [
      { value: 'payments:read', label: 'View payments' },
      { value: 'payments:write', label: 'Create & manage payments' },
    ],
  },
  {
    label: 'Merchants',
    permissions: [
      { value: 'merchants:read', label: 'View merchant info' },
      { value: 'merchants:write', label: 'Edit merchant info' },
    ],
  },
  {
    label: 'Users',
    permissions: [
      { value: 'users:read', label: 'View team members' },
      { value: 'users:write', label: 'Invite & manage users' },
    ],
  },
  {
    label: 'Settings',
    permissions: [
      { value: 'settings:read', label: 'View settings' },
      { value: 'settings:write', label: 'Manage API keys & OAuth' },
    ],
  },
];

export default function RolesPage() {
  const { user } = useAuth();
  const merchantId = user?.merchantId ?? '';
  const { data: roles, isLoading } = useRoles(merchantId);
  const [createOpen, setCreateOpen] = useState(false);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  return (
    <>
      <PageHeader
        actions={
          <Button onClick={() => setCreateOpen(true)}>Create Role</Button>
        }
        description="Manage roles and their permissions"
        title="Roles"
      />

      <div className="mt-6 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          roles?.map((role) => {
            const isExpanded = expandedRole === role.name;
            return (
              <div
                className="rounded-lg border border-zinc-200 bg-white"
                key={role.name}
              >
                <button
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                  onClick={() => setExpandedRole(isExpanded ? null : role.name)}
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-zinc-900">
                      {role.label ?? role.name}
                    </span>
                    {role.builtIn ? (
                      <Badge variant="default">Built-in</Badge>
                    ) : (
                      <Badge variant="brand">Custom</Badge>
                    )}
                  </div>
                  <span className="text-sm text-zinc-400">
                    {role.permissions.length} permissions
                    <span className="ml-2">{isExpanded ? '▲' : '▼'}</span>
                  </span>
                </button>

                {isExpanded ? (
                  <div className="border-t border-zinc-100 px-6 py-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {PERMISSION_GROUPS.map((group) => (
                        <div key={group.label}>
                          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            {group.label}
                          </h4>
                          <div className="space-y-1">
                            {group.permissions.map((perm) => {
                              const hasPermission = role.permissions.includes(perm.value);
                              return (
                                <div
                                  className="flex items-center gap-2 text-sm"
                                  key={perm.value}
                                >
                                  <span
                                    className={
                                      hasPermission
                                        ? 'text-green-600'
                                        : 'text-zinc-300'
                                    }
                                  >
                                    {hasPermission ? '✓' : '—'}
                                  </span>
                                  <span
                                    className={
                                      hasPermission
                                        ? 'text-zinc-700'
                                        : 'text-zinc-400'
                                    }
                                  >
                                    {perm.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>

      <CreateRoleDialog
        merchantId={merchantId}
        onOpenChange={setCreateOpen}
        open={createOpen}
      />
    </>
  );
}
