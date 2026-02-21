'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/useI18n'
import { ossPackages } from '@/lib/oss-data'

export default function OssPage(): React.JSX.Element {
  const { t } = useI18n()

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">
            ← {t.siteTitle}
          </Link>
          <h1 className="text-3xl font-bold">{t.ossPageTitle}</h1>
          <p className="text-muted">{t.ossPageDescription}</p>
        </header>

        <div className="space-y-6">
          {ossPackages.map((pkg) => (
            <section key={pkg.name} className="rounded-xl border border-border bg-surface p-4 md:p-6 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold">{pkg.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full border border-border text-muted">
                  {pkg.licenseType}
                </span>
              </div>
              <a
                href={pkg.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline break-all"
              >
                {pkg.url}
              </a>
              <details>
                <summary className="text-sm text-muted cursor-pointer hover:text-foreground transition-colors select-none">
                  {t.ossLicenseLabel}
                </summary>
                <pre className="mt-2 text-xs text-muted whitespace-pre-wrap break-words bg-background rounded-lg p-4 border border-border">
                  {pkg.licenseText}
                </pre>
              </details>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
