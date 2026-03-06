import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: [
    '@stablebridge/api-client',
    '@stablebridge/auth',
    '@stablebridge/ui',
    '@stablebridge/utils',
    '@stablebridge/types',
  ],
};

export default nextConfig;
