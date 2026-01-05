const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/infra/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // typedRoutes disabled for next-intl compatibility
  // next-intl uses [locale] dynamic segments which conflict with Next.js typed routes
  typedRoutes: false,
  // Transpile @sognora/ui package from node_modules
  transpilePackages: ['@sognora/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:8080/api/v1/:path*',
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);