'use client';

import { useState } from 'react';
import { useAuth } from '@stablebridge/auth';
import { useApiKeys, useRevokeApiKey } from '@stablebridge/api-client/hooks';
import { formatDateTime } from '@stablebridge/utils';
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
import { Spinner } from '@stablebridge/ui/components/spinner';
import { CreateApiKeyDialog } from './create-api-key-dialog';
import { ConfirmDialog } from '../team/confirm-dialog';

export function ApiKeysTab() {
  const { user } = useAuth();
  const merchantId = user?.merchantId ?? '';
  const { data: apiKeys, isLoading } = useApiKeys(merchantId);
  const revokeKey = useRevokeApiKey(merchantId);

  const [createOpen, setCreateOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<{ id: string; name: string } | null>(null);

  function handleRevoke() {
    if (!revokeTarget) return;
    revokeKey.mutate(revokeTarget.id, {
      onSuccess: () => setRevokeTarget(null),
    });
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-zinc-900">API Keys</h3>
          <p className="text-sm text-zinc-500">
            Create and manage API keys for programmatic access.
          </p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          Create API Key
        </Button>
      </div>

      <div className="rounded-lg border border-zinc-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Key Prefix</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys?.map((key) => (
              <TableRow key={key.id}>
                <TableCell className="font-medium">{key.name}</TableCell>
                <TableCell>
                  <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">
                    {key.prefix}...
                  </code>
                </TableCell>
                <TableCell>
                  <Badge variant={key.active ? 'success' : 'destructive'}>
                    {key.active ? 'Active' : 'Revoked'}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-500">
                  {key.lastUsedAt ? formatDateTime(key.lastUsedAt) : 'Never'}
                </TableCell>
                <TableCell className="text-zinc-500">
                  {formatDateTime(key.createdAt)}
                </TableCell>
                <TableCell>
                  {key.active ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setRevokeTarget({ id: key.id, name: key.name })}
                    >
                      Revoke
                    </Button>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
            {apiKeys?.length === 0 ? (
              <TableRow>
                <TableCell className="py-8 text-center text-zinc-500" colSpan={6}>
                  No API keys yet. Create your first key to get started.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <CreateApiKeyDialog
        merchantId={merchantId}
        open={createOpen}
        onOpenChange={setCreateOpen}
      />

      {revokeTarget ? (
        <ConfirmDialog
          destructive
          open
          description={`Are you sure you want to revoke "${revokeTarget.name}"? This action cannot be undone and any integrations using this key will stop working.`}
          isLoading={revokeKey.isPending}
          title="Revoke API Key"
          onConfirm={handleRevoke}
          onOpenChange={(open) => { if (!open) setRevokeTarget(null); }}
        />
      ) : null}
    </>
  );
}
