'use client';

import { useState } from 'react';
import { useAuth } from '@stablebridge/auth';
import { useOAuthClients } from '@stablebridge/api-client/hooks';
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
import { CreateOAuthClientDialog } from './create-oauth-client-dialog';
import { OAuthClientDetailDialog } from './oauth-client-detail-dialog';

interface OAuthClientSummary {
  id: string;
  clientId: string;
  name: string;
  scopes?: string[];
  grantTypes?: string[];
  active: boolean;
  createdAt: string;
}

export function OAuthClientsTab() {
  const { user } = useAuth();
  const merchantId = user?.merchantId ?? '';
  const { data: clients, isLoading } = useOAuthClients(merchantId);

  const [createOpen, setCreateOpen] = useState(false);
  const [detailClient, setDetailClient] = useState<OAuthClientSummary | null>(null);

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
          <h3 className="text-sm font-medium text-zinc-900">OAuth Clients</h3>
          <p className="text-sm text-zinc-500">
            Manage OAuth 2.0 clients for third-party integrations.
          </p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          Create Client
        </Button>
      </div>

      <div className="rounded-lg border border-zinc-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Client ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Scopes</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients?.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>
                  <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">
                    {client.clientId}
                  </code>
                </TableCell>
                <TableCell>
                  <Badge variant={client.active ? 'success' : 'destructive'}>
                    {client.active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-48 truncate text-zinc-500">
                  {client.scopes?.join(', ') ?? '—'}
                </TableCell>
                <TableCell className="text-zinc-500">
                  {formatDateTime(client.createdAt)}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDetailClient(client)}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {clients?.length === 0 ? (
              <TableRow>
                <TableCell className="py-8 text-center text-zinc-500" colSpan={6}>
                  No OAuth clients yet. Create your first client.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <CreateOAuthClientDialog
        merchantId={merchantId}
        open={createOpen}
        onOpenChange={setCreateOpen}
      />

      {detailClient ? (
        <OAuthClientDetailDialog
          open
          client={detailClient}
          onOpenChange={(open) => { if (!open) setDetailClient(null); }}
        />
      ) : null}
    </>
  );
}
