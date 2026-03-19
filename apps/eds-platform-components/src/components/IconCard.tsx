'use client'

import { useState } from 'react'
import { Button } from '@equinor/eds-core-react'
import { copy, check } from '@equinor/eds-icons'
import type { IconData } from '@equinor/eds-icons'
import './icon-card.css'

type IconCardProps = {
  name: string
  iconData: IconData
  color: string
  disabled: boolean
  yamlContent: string
}

export const IconCard = ({
  name,
  iconData,
  color,
  disabled,
  yamlContent,
}: IconCardProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(yamlContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="icon-card">
      <div className="icon-card__header">
        <h3 className="icon-card__title">{iconData.name}</h3>
        <code className="icon-card__id">{name}</code>
      </div>

      <div className="icon-card__preview">
        <svg
          width={iconData.width}
          height={iconData.height}
          viewBox={`0 0 ${iconData.width} ${iconData.height}`}
          className="icon-preview"
          style={{
            color: disabled ? '#BEBEBE' : color,
            width: '64px',
            height: '64px',
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <path
            d={
              Array.isArray(iconData.svgPathData)
                ? iconData.svgPathData[0]
                : iconData.svgPathData
            }
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="icon-card__actions">
        <Button
          variant="outlined"
          onClick={handleCopy}
          className="copy-button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              d={
                copied
                  ? Array.isArray(check.svgPathData)
                    ? check.svgPathData[0]
                    : check.svgPathData
                  : Array.isArray(copy.svgPathData)
                    ? copy.svgPathData[0]
                    : copy.svgPathData
              }
              fill="currentColor"
            />
          </svg>
          {copied ? 'Copied!' : 'Copy YAML'}
        </Button>
      </div>
    </div>
  )
}
