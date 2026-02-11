import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL
  let siteUrl = 'https://aiya000.github.io/vrchat-photos-fovfix'

  if (typeof envSiteUrl === 'string') {
    const trimmed = envSiteUrl.trim()
    if (trimmed !== '') {
      try {
        new URL(trimmed)
        siteUrl = trimmed
      } catch {
        // Ignore invalid value and keep default
      }
    }
  }
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
