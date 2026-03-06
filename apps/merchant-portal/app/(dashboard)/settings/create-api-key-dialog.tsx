'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateApiKey } from '@stablebridge/api-client/hooks';
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

interface CreateApiKeyDialogProps {
  readonly merchantId: string;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function CreateApiKeyDialog({ merchantId, open, onOpenChange }: CreateApiKeyDialogProps) {
  const createApiKey = useCreateApiKey(merchantId);
  const [rawKey, setRawKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
      const result = await createApiKey.mutateAsync({ name: data.name });
      setRawKey(result.rawKey);
    } catch {
      // Error shown via createApiKey.error
    }
  }

  async function handleCopy() {
    if (!rawKey) return;
    await navigator.clipboard.writeText(rawKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleClose(newOpen: boolean) {
    if (!newOpen) {
      reset();
      setRawKey(null);
      setCopied(false);
      createApiKey.reset();
    }
    onOpenChange(newOpen);
  }

  // Show the raw key after creation
  if (rawKey) {
    return (
      <Dialog onOpenChange={handleClose} open={open}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API Key Created</DialogTitle>
            <DialogDescription>
              Copy this key now. You won&apos;t be able to see it again.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Alert variant="success">
              <AlertDescription>
                Your API key has been created successfully.
              </AlertDescription>
            </Alert>

            <div className="flex items-center gap-2">
              <code className="flex-1 overflow-x-auto rounded-md bg-zinc-900 px-4 py-3 font-mono text-sm text-green-400">
                {rawKey}
              </code>
              <Button onClick={handleCopy} size="sm" variant="outline">
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>

            <p className="text-xs text-amber-600">
              Store this key securely. It will not be shown again.
            </p>
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
          <DialogTitle>Create API Key</DialogTitle>
          <DialogDescription>
            Generate a new API key for programmatic access to StableBridge.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {createApiKey.error ? (
            <Alert variant="destructive">
              <AlertDescription>{createApiKey.error.message}</AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="keyName">Key Name</Label>
            <Input
              aria-invalid={errors.name ? 'true' : undefined}
              id="keyName"
              placeholder="e.g., Production Backend"
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
              Create Key
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
