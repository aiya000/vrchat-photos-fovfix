'use client'

import { useEffect } from 'react'

interface DuplicateWarningToastProps {
  message: string
  onClose: () => void
}

export function DuplicateWarningToast({ message, onClose }: DuplicateWarningToastProps): React.JSX.Element {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)
    return () => {
      clearTimeout(timer)
    }
  }, [onClose])

  return (
    <div
      role="alert"
      data-testid="duplicate-warning-toast"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[calc(100%-2rem)] px-4 py-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 text-sm shadow-lg flex items-start gap-2"
    >
      <span className="shrink-0 mt-0.5">⚠️</span>
      <p className="flex-1">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 ml-2 text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200 transition-colors"
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  )
}
