import type { Metadata, Viewport } from 'next'
import './globals.css'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL !== undefined
    ? process.env.NEXT_PUBLIC_SITE_URL
    : 'https://aiya000.github.io/vrchat-photos-fovfix'

export const metadata: Metadata = {
  title: 'VRChat写真歪み修正ツール',
  description: 'VRChat写真のFOV歪みを修正します',
  keywords: ['VRChat', 'FOV', '歪み修正', '写真補正', '樽型歪み', 'barrel distortion'],
  authors: [{ name: 'aiya000' }],
  creator: 'aiya000',
  publisher: 'aiya000',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      ja: siteUrl,
      en: siteUrl,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    alternateLocale: ['en_US'],
    url: siteUrl,
    title: 'VRChat写真歪み修正ツール',
    description: 'VRChat写真のFOV歪みを修正します',
    siteName: 'VRChat写真歪み修正ツール',
    images: [
      {
        url: '/ogp-image.png',
        width: 1200,
        height: 630,
        alt: 'VRChat写真歪み修正ツール',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VRChat写真歪み修正ツール',
    description: 'VRChat写真のFOV歪みを修正します',
    images: ['/ogp-image.png'],
  },
  metadataBase: new URL(siteUrl),
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): React.JSX.Element {
  // JSON-LD structured data for better SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'VRChat写真歪み修正ツール',
    description: 'VRChat写真のFOV（視野角）歪みを修正するWebアプリケーション',
    url: siteUrl,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
    },
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    inLanguage: ['ja', 'en'],
  }

  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
