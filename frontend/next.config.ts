import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Add this line for optimal Docker deployment
  output: 'standalone',

  // Move this to root level (new location in Next.js 15)
  serverExternalPackages: ['pg', 'sqlite3'],

  // Performance optimizations
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['react', 'react-dom', 'lucide-react'],
  },

  // Enable compression
  compress: true,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      // Local development environment
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

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      };
    }

    return config;
  },

  // Headers for better caching and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        // Cache API routes for a reasonable time
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300' // 5 minutes
          }
        ]
      },
      {
        // Cache specific hero image
        source: '/IMG_1682.webp',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=15552000, immutable' // 6 months
          }
        ]
      },
      {
        // Cache other images in subdirectories
        source: '/:path*.(jpg|jpeg|png|webp|avif|ico|svg)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=15552000' // 6 months
          }
        ]
      },
      {
        // Cache fonts for better performance
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable' // 1 year
          }
        ]
      }
    ];
  },

  // Rewrites for better SEO and performance
  async rewrites() {
    return [
      // You can add API rewrites here if needed
      // {
      //   source: '/api/hikes/:path*',
      //   destination: `${process.env.NEXT_PUBLIC_CUSTOM_BACKEND_URL}/api/hikes/:path*`
      // }
    ];
  }
};

export default nextConfig;