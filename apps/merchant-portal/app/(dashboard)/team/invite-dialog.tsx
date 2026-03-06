'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useInviteUser, useRoles } from '@stablebridge/api-client/hooks';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@stablebridge/ui/components/select';
import { Alert, AlertDescription } from '@stablebridge/ui/components/alert';
import { Spinner } from '@stablebridge/ui/components/spinner';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  fullName: z.string().min(1, 'Full name is required'),
  roleId: z.string().min(1, 'Role is required'),
});

type FormData = z.infer<typeof schema>;

interface InviteUserDialogProps {
  readonly merchantId: string;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function InviteUserDialog({ merchantId, open, onOpenChange }: InviteUserDialogProps) {
  const inviteUser = useInviteUser(merchantId);
  const { data: rolesData } = useRoles(merchantId);
  const roles = rolesData?.data ?? [];

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    try {
      await inviteUser.mutateAsync(data);
      reset();
      onOpenChange(false);
    } catch {
      // Error is shown via inviteUser.error
    }
  }

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) {
      reset();
      inviteUser.reset();
    }
    onOpenChange(newOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation email to add a new member to your team.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {inviteUser.error ? (
            <Alert variant="destructive">
              <AlertDescription>{inviteUser.error.message}</AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              aria-invalid={errors.fullName ? 'true' : undefined}
              id="fullName"
              {...register('fullName')}
            />
            {errors.fullName ? (
              <p className="text-xs text-red-600">{errors.fullName.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              aria-invalid={errors.email ? 'true' : undefined}
              id="email"
              placeholder="colleague@company.com"
              type="email"
              {...register('email')}
            />
            {errors.email ? (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              onValueChange={(value) => setValue('roleId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.roleId} value={role.roleId}>
                    {role.roleName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.roleId ? (
              <p className="text-xs text-red-600">{errors.roleId.message}</p>
            ) : null}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? <Spinner size="sm" /> : null}
              Send Invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
