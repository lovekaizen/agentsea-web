import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  // Optional: Add base path if deploying to a subdirectory
  // basePath: '/agentic-sdk',
  // Optional: Configure trailing slashes
  trailingSlash: true,
};

export default nextConfig;
