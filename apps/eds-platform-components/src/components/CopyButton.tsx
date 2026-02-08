'use client'

import { useState } from 'react'
import { Icon } from '@equinor/eds-core-react'
import { copy, check } from '@equinor/eds-icons'

Icon.add({ copy, check })

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
          <Icon data={check} size={16} />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Icon data={copy} size={16} />
          <span>{label}</span>
        </>
      )}
    </button>
  )
}
