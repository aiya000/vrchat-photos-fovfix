/**
 * Normalizes a basePath value for use in Next.js routing and asset paths.
 * Ensures the path starts with "/" and doesn't end with "/".
 *
 * @param raw - The raw basePath value from environment or config
 * @returns Normalized basePath or empty string
 *
 * @example
 * normalizeBasePath('vrchat-photos-fovfix')  // → '/vrchat-photos-fovfix'
 * normalizeBasePath('/vrchat-photos-fovfix') // → '/vrchat-photos-fovfix'
 * normalizeBasePath('/path/')                // → '/path'
 * normalizeBasePath('///path///')            // → '/path'
 * normalizeBasePath('')                      // → ''
 * normalizeBasePath(undefined)               // → ''
 */
export const normalizeBasePath = (raw: string | undefined): string => {
  if (raw === undefined) {
    return "";
  }
  const trimmed = raw.trim();
  if (trimmed === "") {
    return "";
  }
  const withoutSlashes = trimmed.replace(/^\/+|\/+$/g, "");
  if (withoutSlashes === "") {
    return "";
  }
  return `/${withoutSlashes}`;
};
