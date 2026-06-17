import type { NextConfig } from "next";

const apiOrigin = process.env.API_PROXY_ORIGIN ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  assetPrefix: "/catalog-static",
  typedRoutes: true,
  rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiOrigin}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
