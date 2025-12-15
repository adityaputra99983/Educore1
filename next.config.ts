import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configure allowed development origins to fix the cross-origin warning
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://192.168.1.12:3000',
    // Add any other development origins you need
  ],
};

export default nextConfig;