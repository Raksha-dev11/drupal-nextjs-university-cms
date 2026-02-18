import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/drupal_headless/web/sites/default/files/**',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
