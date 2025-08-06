import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Add this line for optimal Docker deployment
  output: 'standalone',

  images: {
    remotePatterns: [
      // This is for your local development environment
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      // Production CMS URL
      {
        protocol: 'https',
        hostname: 'cms-service-623946599151.europe-west2.run.app',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;