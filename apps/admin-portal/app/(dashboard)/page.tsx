'use client';

import { useMerchants } from '@stablebridge/api-client/hooks';
import { Spinner } from '@stablebridge/ui/components/spinner';

const STAT_CARDS = [
  { label: 'Total Merchants', statusFilter: undefined },
  { label: 'Pending Approval', statusFilter: 'PENDING_APPROVAL' as const },
  { label: 'Active', statusFilter: 'ACTIVE' as const },
  { label: 'Suspended', statusFilter: 'SUSPENDED' as const },
] as const;

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-950">Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-500">Overview of merchant operations</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((card) => (
          <StatCard key={card.label} label={card.label} statusFilter={card.statusFilter} />
        ))}
      </div>
    </div>
  );
}

function StatCard({
  label,
  statusFilter,
}: {
  readonly label: string;
  readonly statusFilter: string | undefined;
}) {
  const { data, isLoading } = useMerchants(
    statusFilter ? { status: statusFilter as 'PENDING_APPROVAL' } : undefined,
  );

  return (
    <div className="rounded-lg border border-zinc-200 p-6 shadow-sm">
      <p className="text-sm font-medium text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-zinc-950">
        {isLoading ? <Spinner size="sm" /> : (data?.meta.totalElements ?? '—')}
      </p>
    </div>
  );
}
