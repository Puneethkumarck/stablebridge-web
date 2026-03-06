'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useInviteUser } from '@stablebridge/api-client/hooks';
import type { Role } from '@stablebridge/types';
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

const ROLES: { value: Role; label: string }[] = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'OPERATOR', label: 'Operator' },
  { value: 'VIEWER', label: 'Viewer' },
];

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['ADMIN', 'OPERATOR', 'VIEWER'] as const),
});

type FormData = z.infer<typeof schema>;

interface InviteUserDialogProps {
  readonly merchantId: string;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function InviteUserDialog({ merchantId, open, onOpenChange }: InviteUserDialogProps) {
  const inviteUser = useInviteUser(merchantId);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'VIEWER' },
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
    <Dialog onOpenChange={handleOpenChange} open={open}>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                aria-invalid={errors.firstName ? 'true' : undefined}
                id="firstName"
                {...register('firstName')}
              />
              {errors.firstName ? (
                <p className="text-xs text-red-600">{errors.firstName.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                aria-invalid={errors.lastName ? 'true' : undefined}
                id="lastName"
                {...register('lastName')}
              />
              {errors.lastName ? (
                <p className="text-xs text-red-600">{errors.lastName.message}</p>
              ) : null}
            </div>
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
              defaultValue="VIEWER"
              onValueChange={(value) => setValue('role', value as FormData['role'])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role ? (
              <p className="text-xs text-red-600">{errors.role.message}</p>
            ) : null}
          </div>

          <DialogFooter>
            <Button onClick={() => handleOpenChange(false)} type="button" variant="outline">
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
