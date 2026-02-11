import type { NextConfig } from "next";

const normalizeBasePath = (raw: string | undefined): string => {
  if (raw === null || raw === undefined) {
    return "";
  }
  const trimmed = raw.trim();
  if (trimmed === "") {
    return "";
  }
  const withoutLeading = trimmed.replace(/^\/+/, "");
  const withoutTrailing = withoutLeading.replace(/\/+$/, "");
  if (withoutTrailing === "") {
    return "";
  }
  return `/${withoutTrailing}`;
};

const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

const nextConfig: NextConfig = {
  output: "export",
  ...(basePath !== "" ? { basePath } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
