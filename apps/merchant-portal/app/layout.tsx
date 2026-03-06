import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Providers } from './providers';

import './globals.css';

export const metadata: Metadata = {
  title: 'StableBridge — Merchant Portal',
  description: 'Cross-border B2B payments powered by stablecoins',
};

export default function RootLayout({ children }: { readonly children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
