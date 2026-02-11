'use client'

import type { ProcessedImage } from '@/lib/types'
import type { Translations } from '@/lib/i18n'

interface ComparisonViewProps {
  images: ProcessedImage[]
  t: Translations
}

export function ComparisonView({ images, t }: ComparisonViewProps): React.JSX.Element {
  if (images.length === 0) {
    return <></>
  }

  return (
    <div className="space-y-6">
      {images.map((img) => (
        <div key={img.id} className="rounded-xl border border-border bg-surface p-4">
          <p className="text-sm font-medium mb-3 text-muted">{img.fileName}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted mb-1 text-center">{t.originalLabel}</p>
              <img
                src={img.originalUrl}
                alt={`Original: ${img.fileName}`}
                className="w-full rounded-lg border border-border"
              />
            </div>
            <div>
              <p className="text-xs text-muted mb-1 text-center">{t.fixedLabel}</p>
              <img
                src={img.fixedUrl}
                alt={`Fixed: ${img.fileName}`}
                className="w-full rounded-lg border border-border"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
