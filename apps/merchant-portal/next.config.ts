import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@stablebridge/ui', '@stablebridge/utils', '@stablebridge/types'],
};

export default nextConfig;
