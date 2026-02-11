import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL !== undefined
      ? process.env.NEXT_PUBLIC_SITE_URL
      : 'https://aiya000.github.io/vrchat-photos-fovfix'

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
