'use client'

import Image from 'next/image'
import type { UploadedImage } from '@/lib/types'

interface ImageGridProps {
  images: UploadedImage[]
  onRemove: (id: string) => void
}

export function ImageGrid({ images, onRemove }: ImageGridProps): React.JSX.Element {
  if (images.length === 0) {
    return <></>
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {images.map((img) => (
        <div key={img.id} className="relative group rounded-lg overflow-hidden bg-surface border border-border">
          <Image
            src={img.previewUrl}
            alt={img.file.name}
            className="w-full aspect-square object-cover"
            width={300}
            height={300}
          />
          <button
            type="button"
            onClick={() => {
              onRemove(img.id)
            }}
            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
          >
            ✕
          </button>
          <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 truncate">
            {img.file.name}
          </p>
        </div>
      ))}
    </div>
  )
}
