'use client';

import { useState } from 'react';
import { useChangeUserRole, useRoles } from '@stablebridge/api-client/hooks';
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

interface ChangeRoleDialogProps {
  readonly merchantId: string;
  readonly userId: string;
  readonly userName: string;
  readonly currentRoleId: string;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function ChangeRoleDialog({
  merchantId,
  userId,
  userName,
  currentRoleId,
  open,
  onOpenChange,
}: ChangeRoleDialogProps) {
  const [selectedRoleId, setSelectedRoleId] = useState(currentRoleId);
  const changeRole = useChangeUserRole(merchantId, userId);
  const { data: rolesData } = useRoles(merchantId);
  const roles = rolesData?.data ?? [];

  async function handleSubmit() {
    if (selectedRoleId === currentRoleId) {
      onOpenChange(false);
      return;
    }

    try {
      await changeRole.mutateAsync({ roleId: selectedRoleId });
      onOpenChange(false);
    } catch {
      // Error shown via changeRole.error
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Role</DialogTitle>
          <DialogDescription>
            Update the role for {userName}. This will change their permissions immediately.
          </DialogDescription>
        </DialogHeader>

        {changeRole.error ? (
          <Alert variant="destructive">
            <AlertDescription>{changeRole.error.message}</AlertDescription>
          </Alert>
        ) : null}

        <div className="space-y-2">
          <Label>New Role</Label>
          <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.roleId} value={role.roleId}>
                  {role.roleName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={changeRole.isPending} onClick={handleSubmit}>
            {changeRole.isPending ? <Spinner size="sm" /> : null}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
