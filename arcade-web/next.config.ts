import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Parse API URL for image remote patterns
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
let apiHostname = 'localhost';
let apiPort = '3001';
let apiProtocol: 'http' | 'https' = 'http';
try {
  const parsed = new URL(apiUrl);
  apiHostname = parsed.hostname;
  apiPort = parsed.port;
  apiProtocol = parsed.protocol.replace(':', '') as 'http' | 'https';
} catch {}

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: apiProtocol,
        hostname: apiHostname,
        ...(apiPort ? { port: apiPort } : {}),
        pathname: '/api/v1/media/public/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
