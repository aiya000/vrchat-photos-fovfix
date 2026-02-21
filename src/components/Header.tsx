'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/useI18n'

export function Header(): React.JSX.Element {
  const { t } = useI18n()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="relative border-b border-border bg-surface">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-end">
        <button
          type="button"
          onClick={() => {
            setIsMenuOpen((prev) => !prev)
          }}
          aria-expanded={isMenuOpen}
          aria-label={t.menuButton}
          className="p-2 rounded-md hover:bg-border/30 transition-colors"
        >
          <span className="block w-5 h-0.5 bg-foreground mb-1" />
          <span className="block w-5 h-0.5 bg-foreground mb-1" />
          <span className="block w-5 h-0.5 bg-foreground" />
        </button>
      </div>
      <nav
        className={`absolute right-0 top-full z-50 min-w-48 border border-border bg-surface shadow-lg rounded-bl-xl transition-opacity duration-200 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isMenuOpen}
      >
        <Link
          href="/oss"
          className="block px-4 py-3 text-sm hover:bg-border/30 transition-colors"
          onClick={() => {
            setIsMenuOpen(false)
          }}
        >
          {t.navOssLink}
        </Link>
      </nav>
    </header>
  )
}
