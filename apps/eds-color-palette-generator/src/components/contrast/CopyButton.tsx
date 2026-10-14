'use client'

import { useState, useCallback } from 'react'
import { check, copy as copyIcon } from '@equinor/eds-icons'
import { Icon } from '@/components/shared/Icon'

/**
 * Copies a value from a swatch header. It sits on the swatch colour and
 * takes that colour's label colour, so it stays custom rather than using the
 * accent-coloured Button. It shows on hover and on keyboard focus.
 */
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
      className="inline-flex cursor-pointer items-center gap-1 rounded border-none bg-transparent px-1.5 py-0.5 text-sm text-inherit opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/10 focus-visible:opacity-100"
      title={`Copy ${text}`}
    >
      <Icon data={copied ? check : copyIcon} size={16} />
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}
