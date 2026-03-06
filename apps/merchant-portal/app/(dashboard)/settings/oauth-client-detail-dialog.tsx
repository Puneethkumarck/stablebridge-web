'use client';

import { Button } from '@stablebridge/ui/components/button';
import { Badge } from '@stablebridge/ui/components/badge';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@stablebridge/ui/components/dialog';
import { formatDateTime } from '@stablebridge/utils';

interface OAuthClient {
  id: string;
  clientId: string;
  name: string;
  redirectUris: string[];
  grantTypes?: string[];
  scopes?: string[];
  active: boolean;
  createdAt: string;
}

interface OAuthClientDetailDialogProps {
  readonly client: OAuthClient;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function OAuthClientDetailDialog({
  client,
  open,
  onOpenChange,
}: OAuthClientDetailDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{client.name}</DialogTitle>
        </DialogHeader>

        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-zinc-500">Client ID</dt>
            <dd className="mt-1">
              <code className="rounded bg-zinc-100 px-2 py-1 font-mono text-sm">
                {client.clientId}
              </code>
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-zinc-500">Status</dt>
            <dd className="mt-1">
              <Badge variant={client.active ? 'success' : 'destructive'}>
                {client.active ? 'Active' : 'Inactive'}
              </Badge>
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-zinc-500">Redirect URIs</dt>
            <dd className="mt-1 space-y-1">
              {client.redirectUris.map((uri) => (
                <div key={uri}>
                  <code className="rounded bg-zinc-100 px-2 py-1 text-xs">{uri}</code>
                </div>
              ))}
            </dd>
          </div>

          {client.grantTypes && client.grantTypes.length > 0 ? (
            <div>
              <dt className="text-sm font-medium text-zinc-500">Grant Types</dt>
              <dd className="mt-1 flex flex-wrap gap-1">
                {client.grantTypes.map((grant) => (
                  <Badge key={grant} variant="default">{grant}</Badge>
                ))}
              </dd>
            </div>
          ) : null}

          {client.scopes && client.scopes.length > 0 ? (
            <div>
              <dt className="text-sm font-medium text-zinc-500">Scopes</dt>
              <dd className="mt-1 flex flex-wrap gap-1">
                {client.scopes.map((scope) => (
                  <Badge key={scope} variant="default">{scope}</Badge>
                ))}
              </dd>
            </div>
          ) : null}

          <div>
            <dt className="text-sm font-medium text-zinc-500">Created</dt>
            <dd className="mt-1 text-sm text-zinc-900">
              {formatDateTime(client.createdAt)}
            </dd>
          </div>
        </dl>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
