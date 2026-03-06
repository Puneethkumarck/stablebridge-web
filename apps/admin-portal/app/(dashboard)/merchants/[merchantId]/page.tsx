'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import type { MerchantStatus } from '@stablebridge/types';
import {
  useMerchant,
  useMerchantKybStatus,
  useActivateMerchant,
  useSuspendMerchant,
  useReactivateMerchant,
  useCloseMerchant,
} from '@stablebridge/api-client/hooks';
import { Badge } from '@stablebridge/ui/components/badge';
import { Button } from '@stablebridge/ui/components/button';
import { Spinner } from '@stablebridge/ui/components/spinner';
import { MerchantActionDialog } from './merchant-action-dialog';

const STATUS_VARIANT: Record<MerchantStatus, 'default' | 'success' | 'warning' | 'destructive' | 'brand'> = {
  DRAFT: 'default',
  PENDING_REVIEW: 'warning',
  KYB_IN_PROGRESS: 'brand',
  KYB_APPROVED: 'success',
  KYB_REJECTED: 'destructive',
  ACTIVATED: 'success',
  SUSPENDED: 'destructive',
  DEACTIVATED: 'default',
};

function formatStatus(status: MerchantStatus): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

type ActionType = 'activate' | 'suspend' | 'reactivate' | 'close';

const ACTION_CONFIG: Record<ActionType, { title: string; description: string; destructive: boolean; requiresReason: boolean }> = {
  activate: {
    title: 'Activate Merchant',
    description: 'This will activate the merchant, allowing them to process payments.',
    destructive: false,
    requiresReason: false,
  },
  suspend: {
    title: 'Suspend Merchant',
    description: 'This will suspend the merchant. They will not be able to process payments.',
    destructive: true,
    requiresReason: true,
  },
  reactivate: {
    title: 'Reactivate Merchant',
    description: 'This will reactivate the suspended merchant, restoring their ability to process payments.',
    destructive: false,
    requiresReason: false,
  },
  close: {
    title: 'Close Merchant Account',
    description: 'This will permanently close the merchant account. This action cannot be undone.',
    destructive: true,
    requiresReason: true,
  },
};

function getAvailableActions(status: MerchantStatus): ActionType[] {
  switch (status) {
    case 'KYB_APPROVED':
      return ['activate'];
    case 'ACTIVATED':
      return ['suspend', 'close'];
    case 'SUSPENDED':
      return ['reactivate', 'close'];
    default:
      return [];
  }
}

export default function MerchantDetailPage({
  params,
}: {
  readonly params: Promise<{ merchantId: string }>;
}) {
  const { merchantId } = use(params);
  const { data: merchant, isLoading } = useMerchant(merchantId);
  const { data: kybStatus } = useMerchantKybStatus(merchantId);
  const activateMutation = useActivateMerchant();
  const suspendMutation = useSuspendMerchant();
  const reactivateMutation = useReactivateMerchant();
  const closeMutation = useCloseMerchant();

  const [activeAction, setActiveAction] = useState<ActionType | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500">Merchant not found</p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/merchants">Back to merchants</Link>
        </Button>
      </div>
    );
  }

  const availableActions = getAvailableActions(merchant.status);

  function handleAction(reason?: string) {
    if (!activeAction) return;

    const onSuccess = () => setActiveAction(null);

    switch (activeAction) {
      case 'activate':
        activateMutation.mutate(merchantId, { onSuccess });
        break;
      case 'suspend':
        suspendMutation.mutate({ merchantId, ...(reason ? { reason } : {}) }, { onSuccess });
        break;
      case 'reactivate':
        reactivateMutation.mutate(merchantId, { onSuccess });
        break;
      case 'close':
        closeMutation.mutate({ merchantId, ...(reason ? { reason } : {}) }, { onSuccess });
        break;
    }
  }

  const isMutating =
    activateMutation.isPending ||
    suspendMutation.isPending ||
    reactivateMutation.isPending ||
    closeMutation.isPending;

  return (
    <div>
      <div className="mb-6">
        <Button asChild size="sm" variant="outline">
          <Link href="/merchants">Back to merchants</Link>
        </Button>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950">{merchant.legalName}</h1>
          <p className="mt-1 text-sm text-zinc-500">{merchant.tradingName}</p>
        </div>
        <Badge variant={STATUS_VARIANT[merchant.status]}>
          {formatStatus(merchant.status)}
        </Badge>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 p-6">
          <h2 className="text-lg font-semibold text-zinc-950">Merchant Information</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-500">Legal Name</dt>
              <dd className="font-medium text-zinc-950">{merchant.legalName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Trading Name</dt>
              <dd className="font-medium text-zinc-950">{merchant.tradingName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Registration Number</dt>
              <dd className="font-medium text-zinc-950">{merchant.registrationNumber}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Country</dt>
              <dd className="font-medium text-zinc-950">{merchant.countryCode}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Contact Email</dt>
              <dd className="font-medium text-zinc-950">{merchant.primaryContactEmail}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Contact Name</dt>
              <dd className="font-medium text-zinc-950">{merchant.primaryContactName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Created</dt>
              <dd className="font-medium text-zinc-950">
                {new Date(merchant.createdAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-zinc-200 p-6">
          <h2 className="text-lg font-semibold text-zinc-950">KYB Timeline</h2>
          {kybStatus?.timeline.length ? (
            <ol className="relative mt-4 ml-3 border-l border-zinc-200">
              {kybStatus.timeline.map((event, i) => (
                <li className="mb-6 ml-6 last:mb-0" key={i}>
                  <span className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full border-2 border-white bg-zinc-400" />
                  <div className="flex items-center gap-2">
                    <Badge variant={STATUS_VARIANT[event.status]}>
                      {formatStatus(event.status)}
                    </Badge>
                    <time className="text-xs text-zinc-400">
                      {new Date(event.timestamp).toLocaleString()}
                    </time>
                  </div>
                  {event.note ? (
                    <p className="mt-1 text-sm text-zinc-600">{event.note}</p>
                  ) : null}
                  {event.performedBy ? (
                    <p className="mt-0.5 text-xs text-zinc-400">by {event.performedBy}</p>
                  ) : null}
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">No timeline events yet</p>
          )}
        </div>
      </div>

      {availableActions.length > 0 ? (
        <div className="mt-6 flex gap-3 rounded-lg border border-zinc-200 p-6">
          <h2 className="mr-auto text-lg font-semibold text-zinc-950">Actions</h2>
          {availableActions.map((action) => (
            <Button
              key={action}
              onClick={() => setActiveAction(action)}
              variant={ACTION_CONFIG[action].destructive ? 'destructive' : 'default'}
            >
              {ACTION_CONFIG[action].title}
            </Button>
          ))}
        </div>
      ) : null}

      {activeAction ? (
        <MerchantActionDialog
          description={ACTION_CONFIG[activeAction].description}
          destructive={ACTION_CONFIG[activeAction].destructive}
          isLoading={isMutating}
          onConfirm={handleAction}
          onOpenChange={(open) => { if (!open) setActiveAction(null); }}
          open
          requiresReason={ACTION_CONFIG[activeAction].requiresReason}
          title={ACTION_CONFIG[activeAction].title}
        />
      ) : null}
    </div>
  );
}
