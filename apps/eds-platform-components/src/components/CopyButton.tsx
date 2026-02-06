'use client'

import { useState } from 'react'

type CopyButtonProps = {
  content: string
  label?: string
}

export const CopyButton = ({
  content,
  label = 'Copy YAML',
}: CopyButtonProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="copy-button"
      title={label}
      aria-label={label}
    >
      {copied ? (
        <>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M13.5 2.5L6 10l-3.5-3.5L1 8l5 5 9-9-1.5-1.5z" />
          </svg>
          <span>Copied!</span>
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 2h8v2h2V1a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1V4a2 2 0 0 1 2-2z" />
            <path d="M13 4H6a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z" />
          </svg>
          <span>{label}</span>
        </>
      )}
    </button>
  )
}
