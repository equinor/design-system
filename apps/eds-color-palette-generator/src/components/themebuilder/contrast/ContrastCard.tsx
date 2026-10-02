'use client'

import { useMemo } from 'react'
import { calcContrast, getApcaFontBreakdown } from '@/utils/palette'
import { Badge } from '@/components/shared/Badge'

// Tokens Studio status roles for the similarity warning. EDS has no orange
// or amber tone, so both "Very low" and "Low" use warning.
const SIMILARITY_DANGER = 'bg-danger-muted text-danger-on-muted'
const SIMILARITY_WARNING = 'bg-warning-muted text-warning-on-muted'

type ContrastCardProps = {
  fgHex: string
  bgHex: string
  fgLabel: string
  bgLabel: string
  paletteName: string
  previewType?: 'text' | 'border'
}

export function ContrastCard({
  fgHex,
  bgHex,
  fgLabel,
  bgLabel,
  paletteName,
  previewType = 'text',
}: ContrastCardProps) {
  const result = useMemo(() => calcContrast(fgHex, bgHex), [fgHex, bgHex])
  const wcagNum = parseFloat(result.wcag)
  const absLc = Math.abs(parseFloat(result.apca))

  const fontBreakdown = useMemo(() => getApcaFontBreakdown(absLc), [absLc])

  const similarity = useMemo(() => {
    if (fgHex.toLowerCase() === bgHex.toLowerCase())
      return { label: 'Same colour', tone: SIMILARITY_DANGER }
    if (wcagNum < 1.2)
      return { label: 'Near identical', tone: SIMILARITY_DANGER }
    if (wcagNum < 2) return { label: 'Very low', tone: SIMILARITY_WARNING }
    if (wcagNum < 3) return { label: 'Low', tone: SIMILARITY_WARNING }
    return null
  }, [fgHex, bgHex, wcagNum])

  return (
    <div className="min-w-[200px] overflow-hidden rounded border border-muted">
      {/* Preview area: the colours under test */}
      <div
        className="flex h-[72px] items-center justify-center px-3 py-2"
        style={{ backgroundColor: bgHex }}
      >
        {previewType === 'text' ? (
          <span
            className="text-[28px] leading-none font-medium"
            style={{ color: fgHex }}
          >
            Aa
          </span>
        ) : (
          <div
            className="h-9 w-20 rounded border-2"
            style={{ borderColor: fgHex, backgroundColor: bgHex }}
          />
        )}
      </div>

      {/* Info area */}
      <div className="flex flex-col gap-2 bg-surface p-3">
        <div
          className="truncate text-sm font-medium text-primary"
          title={paletteName}
        >
          {paletteName}
        </div>

        <div className="flex flex-col gap-0.5 text-xs text-secondary">
          <span>
            fg: <span className="font-medium text-primary">{fgLabel}</span>
          </span>
          <span>
            bg: <span className="font-medium text-primary">{bgLabel}</span>
          </span>
        </div>

        {/* WCAG */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-sm font-medium text-primary">
            {result.wcag}
          </span>
          <Badge pass={result.aa} label="AA" />
          <Badge pass={result.aaa} label="AAA" />
          {similarity && (
            <span
              className={`inline-flex items-center rounded px-1.5 text-xs leading-[18px] font-medium tracking-[0.02em] ${similarity.tone}`}
            >
              {similarity.label}
            </span>
          )}
        </div>

        {/* APCA */}
        <div className="text-xs text-secondary">
          APCA{' '}
          <span className="font-mono font-medium text-primary">
            Lc {result.apca}
          </span>
        </div>

        {/* Font size pills */}
        <div className="flex flex-wrap gap-1">
          {fontBreakdown.map(({ size, minWeight }) => {
            const passes = minWeight !== null
            return (
              <span
                key={size}
                className={[
                  'rounded px-[5px] py-px text-xs font-medium',
                  passes
                    ? 'bg-success-muted text-success-on-muted'
                    : 'bg-neutral-muted text-tertiary',
                ].join(' ')}
                title={
                  passes
                    ? `${size}px: min weight ${minWeight}`
                    : `${size}px: fails`
                }
              >
                {size}px
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
