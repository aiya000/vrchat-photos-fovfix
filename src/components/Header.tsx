'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/useI18n'

export function Header(): React.JSX.Element {
  const { t } = useI18n()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isMenuOpen) return

    const firstLink = navRef.current?.querySelector('a')
    firstLink?.focus()

    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === 'Escape') {
        setIsMenuOpen(false)
        buttonRef.current?.focus()
      }
    }

    function handleMouseDown(e: MouseEvent): void {
      if (
        navRef.current !== null &&
        !navRef.current.contains(e.target as Node) &&
        buttonRef.current !== null &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [isMenuOpen])

  return (
    <header className="relative border-b border-border bg-surface">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-end">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => {
            setIsMenuOpen((prev) => !prev)
          }}
          aria-expanded={isMenuOpen}
          aria-controls="nav-menu"
          aria-label={t.menuButton}
          className="p-2 rounded-md hover:bg-border/30 transition-colors"
        >
          <span className="block w-5 h-0.5 bg-foreground mb-1" />
          <span className="block w-5 h-0.5 bg-foreground mb-1" />
          <span className="block w-5 h-0.5 bg-foreground" />
        </button>
      </div>
      <nav
        ref={navRef}
        id="nav-menu"
        className={`absolute right-0 top-full z-50 min-w-48 border border-border bg-surface shadow-lg rounded-bl-xl transition-opacity duration-200 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
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
