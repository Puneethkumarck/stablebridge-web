'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { MerchantStatus } from '@stablebridge/types';
import { useMerchants } from '@stablebridge/api-client/hooks';
import { Badge } from '@stablebridge/ui/components/badge';
import { Button } from '@stablebridge/ui/components/button';
import { Input } from '@stablebridge/ui/components/input';
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
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Pending Review', value: 'PENDING_REVIEW' },
  { label: 'KYB In Progress', value: 'KYB_IN_PROGRESS' },
  { label: 'KYB Approved', value: 'KYB_APPROVED' },
  { label: 'KYB Rejected', value: 'KYB_REJECTED' },
  { label: 'Activated', value: 'ACTIVATED' },
  { label: 'Suspended', value: 'SUSPENDED' },
  { label: 'Deactivated', value: 'DEACTIVATED' },
];

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

export default function MerchantsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<MerchantStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(0);

  const { data, isLoading } = useMerchants({
    ...(search ? { search } : {}),
    ...(statusFilter !== 'ALL' ? { status: statusFilter } : {}),
    page,
    size: 20,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-950">Merchants</h1>
      <p className="mt-1 text-sm text-zinc-500">Review and manage merchant accounts</p>

      <div className="mt-6 flex items-center gap-4">
        <Input
          className="max-w-sm"
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          placeholder="Search merchants..."
          value={search}
        />
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
                  <TableRow key={merchant.id}>
                    <TableCell className="font-medium">{merchant.legalName}</TableCell>
                    <TableCell>{merchant.tradingName}</TableCell>
                    <TableCell>{merchant.countryCode}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[merchant.status]}>
                        {formatStatus(merchant.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/merchants/${merchant.id}`}>Review</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {data && data.meta.totalPages > 1 ? (
              <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-3">
                <p className="text-sm text-zinc-500">
                  Page {data.meta.page + 1} of {data.meta.totalPages} ({data.meta.totalElements} total)
                </p>
                <div className="flex gap-2">
                  <Button
                    disabled={!data.meta.hasPrevious}
                    onClick={() => setPage((p) => p - 1)}
                    size="sm"
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <Button
                    disabled={!data.meta.hasNext}
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
