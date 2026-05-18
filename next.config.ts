import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  trailingSlash: true,
  allowedDevOrigins: [
    'preview-chat-055047de-0ae6-4cd4-b413-8915583557ac.space-z.ai',
  ],
};

export default nextConfig;
