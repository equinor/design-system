'use client'

import { useMemo } from 'react'
import { getApcaFontBreakdown, type ContrastResult } from '@/utils/palette'
import { Badge } from '@/components/shared/Badge'
import { FontSizeChip } from './FontSizeChip'

export function ContrastCell({
  data,
  fgColor,
  bgColor,
  label,
}: {
  data: ContrastResult
  fgColor: string
  bgColor: string
  label: string
}) {
  const lc = parseFloat(data.apca)
  const fontBreakdown = useMemo(() => getApcaFontBreakdown(lc), [lc])

  return (
    <div className="flex flex-col gap-1.5">
      {/* Specimen in the pairing's own colours */}
      <div
        className="rounded border border-muted px-3 py-2 text-center"
        style={{ backgroundColor: bgColor, color: fgColor }}
      >
        <span className="text-xl font-bold">Aa</span>
      </div>

      <div className="text-xs font-medium tracking-wide text-secondary">
        {label}
      </div>

      <div className="flex flex-wrap items-center gap-1">
        <span className="font-mono text-sm font-medium text-primary">
          {data.wcag}:1
        </span>
        <Badge pass={data.aa} label="AA" />
        <Badge pass={data.aaa} label="AAA" />
      </div>

      <div className="mt-1">
        <div className="mb-1 flex items-center gap-1">
          <span className="text-xs text-secondary">APCA</span>
          <span className="font-mono text-sm font-medium text-primary">
            Lc&nbsp;{data.apca}
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {fontBreakdown.map(({ size, minWeightName }) => (
            <FontSizeChip
              key={size}
              size={size}
              minWeightName={minWeightName}
              chipSize="md"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
