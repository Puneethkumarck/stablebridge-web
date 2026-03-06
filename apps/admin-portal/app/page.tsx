import { Button } from '@stablebridge/ui/components/button';
import { PageHeader } from '@stablebridge/ui/layouts/page-header';

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <PageHeader
        title="Admin Portal"
        description="Operations and compliance management for StableBridge"
        actions={<Button variant="outline">Sign In</Button>}
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <DashboardCard title="Merchants" stat="—" description="Total registered merchants" />
        <DashboardCard title="Payments" stat="—" description="Payments processed today" />
      </div>
    </main>
  );
}

function DashboardCard({
  title,
  stat,
  description,
}: {
  readonly title: string;
  readonly stat: string;
  readonly description: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 p-6 shadow-sm">
      <p className="text-sm font-medium text-zinc-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-zinc-950">{stat}</p>
      <p className="mt-1 text-sm text-zinc-400">{description}</p>
    </div>
  );
}
