import type { ReactNode } from 'react';

import { cn } from '../lib/utils';

export interface PageHeaderProps {
  readonly title: string;
  readonly description?: string;
  readonly actions?: ReactNode;
  readonly className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between border-b border-zinc-200 pb-6', className)}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </div>
  );
}
