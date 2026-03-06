'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateRole } from '@stablebridge/api-client/hooks';
import type { Permission } from '@stablebridge/types';
import { Button } from '@stablebridge/ui/components/button';
import { Input } from '@stablebridge/ui/components/input';
import { Label } from '@stablebridge/ui/components/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@stablebridge/ui/components/dialog';
import { Alert, AlertDescription } from '@stablebridge/ui/components/alert';
import { Spinner } from '@stablebridge/ui/components/spinner';

const ALL_PERMISSIONS: { value: Permission; label: string; group: string }[] = [
  { value: 'payments:read', label: 'View payments', group: 'Payments' },
  { value: 'payments:write', label: 'Create & manage payments', group: 'Payments' },
  { value: 'merchants:read', label: 'View merchant info', group: 'Merchants' },
  { value: 'merchants:write', label: 'Edit merchant info', group: 'Merchants' },
  { value: 'users:read', label: 'View team members', group: 'Users' },
  { value: 'users:write', label: 'Invite & manage users', group: 'Users' },
  { value: 'settings:read', label: 'View settings', group: 'Settings' },
  { value: 'settings:write', label: 'Manage API keys & OAuth', group: 'Settings' },
];

const schema = z.object({
  roleName: z.string().min(2, 'Role name is required').max(50),
  description: z.string().max(255).optional(),
});

type FormData = z.infer<typeof schema>;

interface CreateRoleDialogProps {
  readonly merchantId: string;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function CreateRoleDialog({ merchantId, open, onOpenChange }: CreateRoleDialogProps) {
  const createRole = useCreateRole(merchantId);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<Permission>>(new Set());

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  function togglePermission(permission: Permission) {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(permission)) {
        next.delete(permission);
      } else {
        next.add(permission);
      }
      return next;
    });
  }

  async function onSubmit(data: FormData) {
    try {
      await createRole.mutateAsync({
        roleName: data.roleName,
        ...(data.description ? { description: data.description } : {}),
        permissions: [...selectedPermissions],
      });
      reset();
      setSelectedPermissions(new Set());
      onOpenChange(false);
    } catch {
      // Error shown via createRole.error
    }
  }

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) {
      reset();
      setSelectedPermissions(new Set());
      createRole.reset();
    }
    onOpenChange(newOpen);
  }

  const groups = [...new Set(ALL_PERMISSIONS.map((p) => p.group))];

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Custom Role</DialogTitle>
          <DialogDescription>
            Define a new role with specific permissions for your team.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {createRole.error ? (
            <Alert variant="destructive">
              <AlertDescription>{createRole.error.message}</AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="roleName">Role Name</Label>
            <Input
              aria-invalid={errors.roleName ? 'true' : undefined}
              id="roleName"
              placeholder="e.g., Payment Approver"
              {...register('roleName')}
            />
            {errors.roleName ? (
              <p className="text-xs text-red-600">{errors.roleName.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              placeholder="What this role is for"
              {...register('description')}
            />
          </div>

          <div className="space-y-3">
            <Label>Permissions</Label>
            {groups.map((group) => (
              <div key={group}>
                <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  {group}
                </h4>
                <div className="space-y-1">
                  {ALL_PERMISSIONS.filter((p) => p.group === group).map((perm) => (
                    <label
                      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 hover:bg-zinc-50"
                      key={perm.value}
                    >
                      <input
                        checked={selectedPermissions.has(perm.value)}
                        className="h-4 w-4 rounded border-zinc-300 text-brand-600 focus:ring-brand-500"
                        onChange={() => togglePermission(perm.value)}
                        type="checkbox"
                      />
                      <span className="text-sm text-zinc-700">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button onClick={() => handleOpenChange(false)} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={isSubmitting || selectedPermissions.size === 0} type="submit">
              {isSubmitting ? <Spinner size="sm" /> : null}
              Create Role
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
