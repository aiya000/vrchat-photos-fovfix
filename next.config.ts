import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.GITHUB_ACTIONS ? "/vrchat-photos-fovfix" : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
