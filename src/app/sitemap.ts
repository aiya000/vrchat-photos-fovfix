import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL
  let siteUrl = 'https://aiya000.github.io/vrchat-photos-fovfix'

  if (envSiteUrl !== undefined) {
    const trimmed = envSiteUrl.trim()
    if (trimmed !== '') {
      try {
        new URL(trimmed)
        siteUrl = trimmed
      } catch {
        // Ignore invalid env URL and keep default siteUrl.
      }
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
