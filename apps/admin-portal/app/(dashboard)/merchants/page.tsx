'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { MerchantStatus } from '@stablebridge/types';
import { useMerchants } from '@stablebridge/api-client/hooks';
import { Badge } from '@stablebridge/ui/components/badge';
import { Button } from '@stablebridge/ui/components/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@stablebridge/ui/components/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@stablebridge/ui/components/data-table';
import { Spinner } from '@stablebridge/ui/components/spinner';

const STATUS_OPTIONS: { label: string; value: MerchantStatus | 'ALL' }[] = [
  { label: 'All Statuses', value: 'ALL' },
  { label: 'Applied', value: 'APPLIED' },
  { label: 'KYB In Progress', value: 'KYB_IN_PROGRESS' },
  { label: 'KYB Manual Review', value: 'KYB_MANUAL_REVIEW' },
  { label: 'KYB Rejected', value: 'KYB_REJECTED' },
  { label: 'Pending Approval', value: 'PENDING_APPROVAL' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Suspended', value: 'SUSPENDED' },
  { label: 'Closed', value: 'CLOSED' },
];

const STATUS_VARIANT: Record<MerchantStatus, 'default' | 'success' | 'warning' | 'destructive' | 'brand'> = {
  APPLIED: 'default',
  KYB_IN_PROGRESS: 'brand',
  KYB_MANUAL_REVIEW: 'warning',
  KYB_REJECTED: 'destructive',
  PENDING_APPROVAL: 'warning',
  ACTIVE: 'success',
  SUSPENDED: 'destructive',
  CLOSED: 'default',
};

function formatStatus(status: MerchantStatus): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function MerchantsPage() {
  const [statusFilter, setStatusFilter] = useState<MerchantStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(0);

  const { data, isLoading } = useMerchants({
    ...(statusFilter !== 'ALL' ? { status: statusFilter } : {}),
    page,
    size: 20,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-950">Merchants</h1>
      <p className="mt-1 text-sm text-zinc-500">Review and manage merchant accounts</p>

      <div className="mt-6 flex items-center gap-4">
        <Select
          onValueChange={(v) => {
            setStatusFilter(v as MerchantStatus | 'ALL');
            setPage(0);
          }}
          value={statusFilter}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 rounded-lg border border-zinc-200">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Legal Name</TableHead>
                  <TableHead>Trading Name</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.length === 0 ? (
                  <TableRow>
                    <TableCell className="text-center text-zinc-500" colSpan={5}>
                      No merchants found
                    </TableCell>
                  </TableRow>
                ) : null}
                {data?.data.map((merchant) => (
                  <TableRow key={merchant.merchantId}>
                    <TableCell className="font-medium">{merchant.legalName}</TableCell>
                    <TableCell>{merchant.tradingName}</TableCell>
                    <TableCell>{merchant.registrationCountry}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[merchant.status]}>
                        {formatStatus(merchant.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/merchants/${merchant.merchantId}`}>Review</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {data && data.page.totalPages > 1 ? (
              <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-3">
                <p className="text-sm text-zinc-500">
                  Page {data.page.number + 1} of {data.page.totalPages} ({data.page.totalElements} total)
                </p>
                <div className="flex gap-2">
                  <Button
                    disabled={data.page.number === 0}
                    onClick={() => setPage((p) => p - 1)}
                    size="sm"
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <Button
                    disabled={data.page.number + 1 >= data.page.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    size="sm"
                    variant="outline"
                  >
                    Next
                  </Button>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
