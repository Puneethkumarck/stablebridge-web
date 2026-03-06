'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateOAuthClient } from '@stablebridge/api-client/hooks';
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

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
});

type FormData = z.infer<typeof schema>;

interface CreatedClient {
  clientId: string;
  clientSecret: string;
  name: string;
}

interface CreateOAuthClientDialogProps {
  readonly merchantId: string;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function CreateOAuthClientDialog({
  merchantId,
  open,
  onOpenChange,
}: CreateOAuthClientDialogProps) {
  const createClient = useCreateOAuthClient(merchantId);
  const [created, setCreated] = useState<CreatedClient | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    try {
      const result = await createClient.mutateAsync({
        name: data.name,
      });
      setCreated({
        clientId: result.clientId,
        clientSecret: result.clientSecret,
        name: result.name,
      });
    } catch {
      // Error shown via createClient.error
    }
  }

  async function handleCopy(value: string, field: string) {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }

  function handleClose(newOpen: boolean) {
    if (!newOpen) {
      reset();
      setCreated(null);
      setCopiedField(null);
      createClient.reset();
    }
    onOpenChange(newOpen);
  }

  if (created) {
    return (
      <Dialog onOpenChange={handleClose} open={open}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>OAuth Client Created</DialogTitle>
            <DialogDescription>
              Copy the client secret now. You won&apos;t be able to see it again.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert variant="success">
              <AlertDescription>
                &quot;{created.name}&quot; has been created successfully.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label>Client ID</Label>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-md bg-zinc-100 px-3 py-2 font-mono text-sm">
                  {created.clientId}
                </code>
                <Button
                  onClick={() => handleCopy(created.clientId, 'id')}
                  size="sm"
                  variant="outline"
                >
                  {copiedField === 'id' ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Client Secret</Label>
              <div className="flex items-center gap-2">
                <code className="flex-1 overflow-x-auto rounded-md bg-zinc-900 px-3 py-2 font-mono text-sm text-green-400">
                  {created.clientSecret}
                </code>
                <Button
                  onClick={() => handleCopy(created.clientSecret, 'secret')}
                  size="sm"
                  variant="outline"
                >
                  {copiedField === 'secret' ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <p className="text-xs text-amber-600">
                Store this secret securely. It will not be shown again.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => handleClose(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog onOpenChange={handleClose} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create OAuth Client</DialogTitle>
          <DialogDescription>
            Register a new OAuth 2.0 client for API access.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {createClient.error ? (
            <Alert variant="destructive">
              <AlertDescription>{createClient.error.message}</AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              aria-invalid={errors.name ? 'true' : undefined}
              id="clientName"
              placeholder="e.g., My Integration"
              {...register('name')}
            />
            {errors.name ? (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            ) : null}
          </div>

          <DialogFooter>
            <Button onClick={() => handleClose(false)} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? <Spinner size="sm" /> : null}
              Create Client
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
