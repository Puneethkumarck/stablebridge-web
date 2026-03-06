import { Button } from '@stablebridge/ui/components/button';
import { PageHeader } from '@stablebridge/ui/layouts/page-header';

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <PageHeader
        actions={<Button>Get Started</Button>}
        description="Cross-border B2B payments powered by stablecoins"
        title="StableBridge"
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          description="Send payments globally with near-instant settlement via blockchain rails."
          title="Fast Settlement"
        />
        <FeatureCard
          description="Real-time exchange rates with no hidden fees or markups."
          title="Transparent FX"
        />
        <FeatureCard
          description="Automated KYB, AML screening, and regulatory compliance."
          title="Compliance Built-in"
        />
      </div>
    </main>
  );
}

function FeatureCard({
  title,
  description,
}: {
  readonly title: string;
  readonly description: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-zinc-950">{title}</h3>
      <p className="mt-2 text-sm text-zinc-500">{description}</p>
    </div>
  );
}
