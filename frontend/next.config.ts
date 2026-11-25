import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    // On Vercel Services, top-level vercel.json rewrites handle /api/* -> backend.
    // Keep this rewrite only for local `next dev` / standalone runs outside Vercel.
    if (process.env.VERCEL) {
      return [];
    }
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
