/**
 * Normalizes a basePath value for use in Next.js routing and asset paths.
 * Ensures the path starts with "/" and doesn't end with "/".
 *
 * @param raw - The raw basePath value from environment or config
 * @returns Normalized basePath or empty string
 */
export const normalizeBasePath = (raw: string | undefined): string => {
  if (raw === undefined) {
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
