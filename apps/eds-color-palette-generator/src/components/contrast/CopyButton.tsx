'use client'

import { useState, useCallback } from 'react'

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }, [text])

  return (
    <button
      type="button"
      onClick={copy}
      className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      style={{
        background: 'none',
        border: 'none',
        padding: '2px 6px',
        fontSize: '11px',
        color: 'inherit',
        borderRadius: '4px',
      }}
      title={`Copy ${text}`}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}
