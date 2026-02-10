import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  ...(process.env.GITHUB_ACTIONS ? { basePath: "/vrchat-photos-fovfix" } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
