import type { NextConfig } from "next";

const CANONICAL = "https://moral-maps.vercel.app";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        destination: CANONICAL,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
