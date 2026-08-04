import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/advanced', destination: '/advanced-ccaf', permanent: true },
      { source: '/advanced/:path*', destination: '/advanced-ccaf/:path*', permanent: true },
      { source: '/professional', destination: '/professional-ccarp', permanent: true },
      { source: '/professional/:path*', destination: '/professional-ccarp/:path*', permanent: true },
    ];
  },
};

export default nextConfig;
