import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BASE_URL: process.env.BASE_URL,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.BASE_URL + "/api/:path*",
      },
    ];
  },
};

export default nextConfig;
