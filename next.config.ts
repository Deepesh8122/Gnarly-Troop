import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ['192.168.88.10'],
  serverExternalPackages: ["pdfkit", "fontkit"],
  outputFileTracingIncludes: {
    "/*": ["./node_modules/pdfkit/js/data/**/*"],
  },
  turbopack: {
    root: './',
  },
  // output: "export", // enables static export
  trailingSlash: true,
};

export default nextConfig;
