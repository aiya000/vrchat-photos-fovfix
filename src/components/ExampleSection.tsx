'use client'

import type { Translations } from '@/lib/i18n'
import { normalizeBasePath } from '../../basePath.config'

interface ExampleSectionProps {
  t: Translations
}

export function ExampleSection({ t }: ExampleSectionProps): React.JSX.Element {
  const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH)

  return (
    <section className="rounded-xl border border-border bg-surface p-4 md:p-6">
      <h2 className="text-lg font-semibold mb-2">{t.exampleTitle}</h2>
      <p className="text-sm text-muted mb-4">{t.exampleDescription}</p>

      <div className="grid grid-cols-2 gap-2 md:gap-4">
        <div className="space-y-1">
          <p className="text-xs text-muted text-center font-medium">{t.exampleBefore}</p>
          <div className="aspect-[9/16]">
            <img
              src={`${basePath}/examples/before.png`}
              alt={t.exampleBeforeAlt}
              className="w-full h-full object-cover rounded-lg border border-border"
              loading="lazy"
            />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted text-center font-medium">{t.exampleAfter}</p>
          <div className="aspect-[9/16]">
            <img
              src={`${basePath}/examples/after.png`}
              alt={t.exampleAfterAlt}
              className="w-full h-full object-cover rounded-lg border border-border"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
