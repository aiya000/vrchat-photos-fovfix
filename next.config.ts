import type { NextConfig } from "next";
import { normalizeBasePath } from "./basePath.config";

const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

const nextConfig: NextConfig = {
  output: "export",
  ...(basePath !== "" ? { basePath } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
