import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    BASE_URL: process.env.BASE_URL,
  },

  redirects: async () => {
    return [
      {
        source: "/api/:path*",
        destination: process.env.BASE_URL + "/api/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
