import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.8'],
  images: {
    unoptimized: true,
  },
  output: "export",
};

export default nextConfig;
