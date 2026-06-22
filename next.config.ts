import type { NextConfig } from "next";

const DEFAULT_API_PROXY_ORIGIN = "http://localhost:4000";

function resolveApiProxyOrigin() {
  const rawOrigin =
    process.env.API_PROXY_ORIGIN ?? process.env.API_INTERNAL_URL ?? DEFAULT_API_PROXY_ORIGIN;

  return new URL(rawOrigin).origin;
}

const apiProxyOrigin = resolveApiProxyOrigin();

const nextConfig: NextConfig = {
  assetPrefix: "/catalog-static",
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
        protocol: "https",
      },
    ],
  },
  typedRoutes: true,
  rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiProxyOrigin}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
