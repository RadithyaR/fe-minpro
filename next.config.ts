import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    domains: ["localhost"],
    // atau untuk konfigurasi yang lebih spesifik:
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/event-images/**",
      },
    ],
  },
};

export default nextConfig;
