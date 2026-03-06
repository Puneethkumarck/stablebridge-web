'use client';

import { useState } from 'react';
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
import { Spinner } from '@stablebridge/ui/components/spinner';

interface MerchantActionDialogProps {
  readonly title: string;
  readonly description: string;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onConfirm: (reason?: string) => void;
  readonly isLoading: boolean;
  readonly destructive: boolean;
  readonly requiresReason: boolean;
}

export function MerchantActionDialog({
  title,
  description,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  destructive,
  requiresReason,
}: MerchantActionDialogProps) {
  const [reason, setReason] = useState('');

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {requiresReason ? (
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Input
              id="reason"
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a reason..."
              value={reason}
            />
          </div>
        ) : null}
        <DialogFooter>
          <Button disabled={isLoading} onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button
            disabled={isLoading || (requiresReason && !reason.trim())}
            onClick={() => onConfirm(reason || undefined)}
            variant={destructive ? 'destructive' : 'default'}
          >
            {isLoading ? <Spinner size="sm" /> : null}
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
