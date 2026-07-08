'use client'

import { useMemo } from 'react'
import { calcContrast, getApcaFontBreakdown } from '@/utils/palette'
import { Badge } from '@/components/Badge'

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
      return { label: 'Same color', bg: '#fef2f2', color: '#991b1b' }
    if (wcagNum < 1.2)
      return { label: 'Near identical', bg: '#fef2f2', color: '#991b1b' }
    if (wcagNum < 2)
      return { label: 'Very low', bg: '#fff7ed', color: '#9a3412' }
    if (wcagNum < 3)
      return { label: 'Low', bg: '#fffbeb', color: '#92400e' }
    return null
  }, [fgHex, bgHex, wcagNum])

  return (
    <div
      className="rounded-lg border border-neutral-subtle overflow-hidden"
      style={{ minWidth: 200 }}
    >
      {/* Preview area */}
      <div
        className="flex items-center justify-center"
        style={{
          backgroundColor: bgHex,
          height: 72,
          padding: '8px 12px',
        }}
      >
        {previewType === 'text' ? (
          <span
            style={{
              color: fgHex,
              fontSize: 28,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            Aa
          </span>
        ) : (
          <div
            className="rounded"
            style={{
              border: `2px solid ${fgHex}`,
              backgroundColor: bgHex,
              width: 80,
              height: 36,
            }}
          />
        )}
      </div>

      {/* Info area */}
      <div className="p-3 flex flex-col gap-2 bg-default">
        <div
          className="text-xs font-semibold text-strong truncate"
          title={paletteName}
        >
          {paletteName}
        </div>

        <div className="flex flex-col gap-0.5 text-[11px] text-subtle">
          <span>
            fg: <span className="font-medium text-strong">{fgLabel}</span>
          </span>
          <span>
            bg: <span className="font-medium text-strong">{bgLabel}</span>
          </span>
        </div>

        {/* WCAG */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-mono font-semibold text-strong">
            {result.wcag}
          </span>
          <Badge pass={result.aa} label="AA" />
          <Badge pass={result.aaa} label="AAA" />
          {similarity && (
            <span
              className="inline-flex items-center rounded font-semibold"
              style={{
                padding: '1px 6px',
                fontSize: '10px',
                lineHeight: '18px',
                letterSpacing: '0.02em',
                backgroundColor: similarity.bg,
                color: similarity.color,
              }}
            >
              {similarity.label}
            </span>
          )}
        </div>

        {/* APCA */}
        <div className="text-[11px] text-subtle">
          APCA{' '}
          <span className="font-mono font-semibold text-strong">
            Lc {result.apca}
          </span>
        </div>

        {/* Font size pills */}
        <div className="flex gap-1 flex-wrap">
          {fontBreakdown.map(({ size, minWeight }) => {
            const passes = minWeight !== null
            return (
              <span
                key={size}
                className="rounded text-[10px] font-medium"
                style={{
                  padding: '1px 5px',
                  backgroundColor: passes ? '#dcfce7' : '#f3f4f6',
                  color: passes ? '#166534' : '#9ca3af',
                }}
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
