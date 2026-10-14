'use client'

import { useMemo } from 'react'
import { calcContrast, getApcaFontBreakdown } from '@/utils/palette'
import { Badge } from '@/components/shared/Badge'
import { FontSizeChip } from '@/components/contrast/FontSizeChip'

export function PairingCard({
  fgRole,
  bgRole,
  fgHex,
  bgHex,
  type = 'text',
}: {
  fgRole: string
  bgRole: string
  fgHex: string
  bgHex: string
  type?: 'text' | 'border'
}) {
  const result = useMemo(() => calcContrast(fgHex, bgHex), [fgHex, bgHex])
  const lc = parseFloat(result.apca)
  const fontBreakdown = useMemo(() => getApcaFontBreakdown(lc), [lc])

  return (
    <div className="overflow-hidden rounded border border-muted bg-surface">
      {/* Visual preview in the pairing's own colours */}
      <div
        className={type === 'border' ? 'px-5 py-4' : 'px-3 py-4'}
        style={{ backgroundColor: bgHex }}
      >
        {type === 'border' ? (
          <div
            className="rounded px-3 py-2.5 text-base text-tertiary"
            style={{
              border: `2px solid ${fgHex}`,
              backgroundColor: bgHex,
            }}
          >
            Placeholder
          </div>
        ) : (
          <div className="text-center">
            <span className="text-2xl font-bold" style={{ color: fgHex }}>
              Aa
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-3 py-2.5 text-xs text-secondary">
        {/* Variable labels */}
        <div className="mb-1.5 leading-normal">
          <div>
            fg: <strong className="font-medium text-primary">{fgRole}</strong>
          </div>
          <div>
            bg: <strong className="font-medium text-primary">{bgRole}</strong>
          </div>
        </div>

        {/* WCAG */}
        <div className="mb-1 flex flex-wrap items-center gap-1">
          <span className="font-mono text-sm font-medium text-primary">
            {result.wcag}:1
          </span>
          <Badge pass={result.aa} label="AA" />
          <Badge pass={result.aaa} label="AAA" />
        </div>

        {/* APCA */}
        <div className="mb-1 flex items-center gap-1">
          <span className="text-tertiary">APCA</span>
          <span className="font-mono text-sm font-medium text-primary">
            Lc&nbsp;{result.apca}
          </span>
        </div>

        {/* Font sizes */}
        <div className="flex flex-wrap gap-1">
          {fontBreakdown.map(({ size, minWeightName }) => (
            <FontSizeChip
              key={size}
              size={size}
              minWeightName={minWeightName}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
