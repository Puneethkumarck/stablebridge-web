'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useAuth, useLogout } from '@stablebridge/auth';
import { Button } from '@stablebridge/ui/components/button';
import { Spinner } from '@stablebridge/ui/components/spinner';
import { cn } from '@stablebridge/ui/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: 'grid' },
  { href: '/team', label: 'Team', icon: 'users' },
  { href: '/settings', label: 'Settings', icon: 'settings' },
] as const;

export default function DashboardLayout({ children }: { readonly children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const logout = useLogout();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-zinc-200 bg-zinc-50">
        <div className="flex h-16 items-center border-b border-zinc-200 px-6">
          <Link className="text-lg font-bold text-brand-600" href="/">
            StableBridge
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

            return (
              <Link
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-zinc-200 p-4">
          <div className="mb-3 truncate text-sm text-zinc-600">
            {user?.email}
          </div>
          <Button className="w-full" size="sm" variant="outline" onClick={logout}>
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
