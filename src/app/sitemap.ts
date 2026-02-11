import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  let siteUrl = 'https://aiya000.github.io/vrchat-photos-fovfix'

  if (envSiteUrl) {
    try {
      // Validate that the URL is absolute; if invalid, fall back to default.
      // The URL constructor will throw for invalid URLs.
      // eslint-disable-next-line no-new
      new URL(envSiteUrl)
      siteUrl = envSiteUrl
    } catch {
      // Ignore invalid env URL and keep default siteUrl.
    }
  }
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: {
          ja: siteUrl,
          en: siteUrl,
        },
      },
    },
  ]
}
