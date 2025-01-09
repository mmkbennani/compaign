import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_PAGE_SIZE_CAMPAIGN: process.env.NEXT_PUBLIC_PAGE_SIZE_CAMPAIGN,
  },
};

export default nextConfig;