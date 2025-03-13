import type { NextConfig } from "next";

const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/events",
        permanent: true, // Set to true for 308 (permanent) or false for 307 (temporary)
      },
    ];
  },
};

export default nextConfig;
