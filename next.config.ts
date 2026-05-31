import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ['192.168.88.4'],
  turbopack: {
    root: './',
  },
  // output: "export", // enables static export
  trailingSlash: true,
};

export default nextConfig;
