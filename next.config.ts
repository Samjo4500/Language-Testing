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
  // Allow the Z.ai preview proxy to load assets cross-origin
  allowedDevOrigins: [
    'preview-chat-055047de-0ae6-4cd4-b413-8915583557ac.space-z.ai',
  ],
};

export default nextConfig;
