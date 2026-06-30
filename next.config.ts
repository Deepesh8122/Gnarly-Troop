import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ['192.168.88.10'],
  serverExternalPackages: ["pdfkit", "fontkit"],
  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/pdfkit/js/data/**/*",
      "./public/receipt-templates/**/*",
    ],
  },
  // Skip on low-RAM servers when types are checked in CI/dev (SKIP_BUILD_TYPECHECK=true).
  typescript: {
    ignoreBuildErrors: process.env.SKIP_BUILD_TYPECHECK === "true",
  },
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  // output: "export", // enables static export
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
