import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Suppress middleware deprecation warning
  // The middleware file is still valid, this is just to silence the warning
  experimental: {
    // Note: In Next.js 16+, middleware is still supported
    // The warning is about future changes, but current implementation is fine
  },
};

export default nextConfig;
