'use client';

import { useState } from 'react';
import { useUpdateUser } from '@stablebridge/api-client/hooks';
import type { Role } from '@stablebridge/types';
import { Button } from '@stablebridge/ui/components/button';
import { Label } from '@stablebridge/ui/components/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@stablebridge/ui/components/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@stablebridge/ui/components/select';
import { Alert, AlertDescription } from '@stablebridge/ui/components/alert';
import { Spinner } from '@stablebridge/ui/components/spinner';

const ROLES: { value: Role; label: string }[] = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'OPERATOR', label: 'Operator' },
  { value: 'VIEWER', label: 'Viewer' },
];

interface ChangeRoleDialogProps {
  readonly merchantId: string;
  readonly userId: string;
  readonly userName: string;
  readonly currentRole: string;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function ChangeRoleDialog({
  merchantId,
  userId,
  userName,
  currentRole,
  open,
  onOpenChange,
}: ChangeRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState<Role>(currentRole as Role);
  const updateUser = useUpdateUser(merchantId, userId);

  async function handleSubmit() {
    if (selectedRole === currentRole) {
      onOpenChange(false);
      return;
    }

    try {
      await updateUser.mutateAsync({ role: selectedRole });
      onOpenChange(false);
    } catch {
      // Error shown via updateUser.error
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Role</DialogTitle>
          <DialogDescription>
            Update the role for {userName}. This will change their permissions immediately.
          </DialogDescription>
        </DialogHeader>

        {updateUser.error ? (
          <Alert variant="destructive">
            <AlertDescription>{updateUser.error.message}</AlertDescription>
          </Alert>
        ) : null}

        <div className="space-y-2">
          <Label>New Role</Label>
          <Select onValueChange={(v) => setSelectedRole(v as Role)} value={selectedRole}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} type="button" variant="outline">
            Cancel
          </Button>
          <Button disabled={updateUser.isPending} onClick={handleSubmit}>
            {updateUser.isPending ? <Spinner size="sm" /> : null}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
