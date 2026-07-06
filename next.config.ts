import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Ensure images are handled correctly in Docker
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
