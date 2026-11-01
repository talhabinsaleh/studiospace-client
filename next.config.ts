import type { NextConfig } from "next";

const apiUrl = process.env.API_URL ?? "http://localhost:5000";

const nextConfig: NextConfig = {
  // Browser calls to /api/* reach Express through this domain, so the HTTPOnly JWT cookie stays
  // first-party. "fallback" runs after local routes, which keeps /api/auth/* on BetterAuth.
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [{ source: "/api/:path*", destination: `${apiUrl}/api/:path*` }],
    };
  },
};

export default nextConfig;
