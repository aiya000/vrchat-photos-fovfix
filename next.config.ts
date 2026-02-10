import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/vrchat-photos-fovfix",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
