import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  poweredByHeader: false,

  // Acknowledge Turbopack (Next.js 16 default) — webpack config used for production builds
  turbopack: {},

  // Optimize barrel-exported libraries — dramatically reduces bundle size
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'date-fns',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-dialog',
      '@radix-ui/react-accordion',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      'recharts',
    ],
  },

  // Remove console.log in production (keep warn/error)
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['warn', 'error'] }
      : false,
  },

  // Webpack optimizations — reduce TBT by splitting vendor chunks
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
          ui: {
            test: /[\\/]node_modules[\\/](@radix-ui|framer-motion)[\\/]/,
            name: 'ui-libs',
            chunks: 'all',
            priority: 20,
          },
          analytics: {
            test: /[\\/]node_modules[\\/](@vercel\/analytics|@vercel\/speed-insights|posthog-js)[\\/]/,
            name: 'analytics',
            chunks: 'all',
            priority: 15,
          },
        },
      };
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
