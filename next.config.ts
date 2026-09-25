import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Prevent build failures on Vercel from non-blocking lint rules
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ensure strict type checking
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      }
    ],
  },
};

export default nextConfig;
