'use client';

import { useState } from 'react';
import { useAuth } from '@stablebridge/auth';
import { useMerchantUsers, useSuspendUser, useReactivateUser, useRoles } from '@stablebridge/api-client/hooks';
import { PageHeader } from '@stablebridge/ui/layouts/page-header';
import { Button } from '@stablebridge/ui/components/button';
import { Badge } from '@stablebridge/ui/components/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@stablebridge/ui/components/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@stablebridge/ui/components/dropdown-menu';
import { Spinner } from '@stablebridge/ui/components/spinner';
import { formatRelativeTime } from '@stablebridge/utils';
import { InviteUserDialog } from './invite-dialog';
import { ChangeRoleDialog } from './change-role-dialog';
import { ConfirmDialog } from './confirm-dialog';

export default function TeamPage() {
  const { user } = useAuth();
  const merchantId = user?.merchantId ?? '';

  const { data, isLoading } = useMerchantUsers({ merchantId });
  const suspendUser = useSuspendUser(merchantId);
  const reactivateUser = useReactivateUser(merchantId);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [roleDialogUser, setRoleDialogUser] = useState<{ id: string; name: string; roleId: string; roleName: string } | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    userId: string;
    name: string;
    action: 'suspend' | 'reactivate';
  } | null>(null);

  function handleConfirmAction() {
    if (!confirmAction) return;
    if (confirmAction.action === 'suspend') {
      suspendUser.mutate({ userId: confirmAction.userId });
    } else {
      reactivateUser.mutate(confirmAction.userId);
    }
    setConfirmAction(null);
  }

  return (
    <>
      <PageHeader
        actions={
          <Button onClick={() => setInviteOpen(true)}>Invite User</Button>
        }
        description="Manage your team members, roles, and permissions"
        title="Team"
      />

      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="rounded-lg border border-zinc-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.map((member) => (
                  <TableRow key={member.userId}>
                    <TableCell className="font-medium">
                      {member.fullName}
                    </TableCell>
                    <TableCell className="text-zinc-500">{member.email}</TableCell>
                    <TableCell>
                      <Badge variant="brand">{member.role.roleName}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.status === 'ACTIVE' ? 'success' : 'destructive'}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-500">
                      {member.lastLoginAt
                        ? formatRelativeTime(member.lastLoginAt)
                        : 'Never'}
                    </TableCell>
                    <TableCell>
                      {member.userId !== user?.id ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <span className="text-lg leading-none">&#8230;</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onSelect={() =>
                                setRoleDialogUser({
                                  id: member.userId,
                                  name: member.fullName,
                                  roleId: member.role.roleId,
                                  roleName: member.role.roleName,
                                })
                              }
                            >
                              Change role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {member.status === 'ACTIVE' ? (
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onSelect={() =>
                                  setConfirmAction({
                                    userId: member.userId,
                                    name: member.fullName,
                                    action: 'suspend',
                                  })
                                }
                              >
                                Suspend user
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onSelect={() =>
                                  setConfirmAction({
                                    userId: member.userId,
                                    name: member.fullName,
                                    action: 'reactivate',
                                  })
                                }
                              >
                                Reactivate user
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
                {data?.data.length === 0 ? (
                  <TableRow>
                    <TableCell className="py-8 text-center text-zinc-500" colSpan={6}>
                      No team members yet. Invite your first user.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <InviteUserDialog
        merchantId={merchantId}
        onOpenChange={setInviteOpen}
        open={inviteOpen}
      />

      {roleDialogUser ? (
        <ChangeRoleDialog
          currentRoleId={roleDialogUser.roleId}
          merchantId={merchantId}
          onOpenChange={(open) => { if (!open) setRoleDialogUser(null); }}
          open
          userId={roleDialogUser.id}
          userName={roleDialogUser.name}
        />
      ) : null}

      {confirmAction ? (
        <ConfirmDialog
          description={
            confirmAction.action === 'suspend'
              ? `Are you sure you want to suspend ${confirmAction.name}? They will lose access immediately.`
              : `Are you sure you want to reactivate ${confirmAction.name}? They will regain access.`
          }
          destructive={confirmAction.action === 'suspend'}
          isLoading={suspendUser.isPending || reactivateUser.isPending}
          onConfirm={handleConfirmAction}
          onOpenChange={(open) => { if (!open) setConfirmAction(null); }}
          open
          title={confirmAction.action === 'suspend' ? 'Suspend User' : 'Reactivate User'}
        />
      ) : null}
    </>
  );
}
