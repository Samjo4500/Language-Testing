import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow trailing slashes to prevent redirect loops with reverse proxies
  // that add trailing slashes (e.g. Z.ai preview proxy: /dashboard → /dashboard/)
  // Without this, Next.js redirects /dashboard/ → /dashboard (308) creating an infinite loop
  trailingSlash: true,
};

export default nextConfig;
