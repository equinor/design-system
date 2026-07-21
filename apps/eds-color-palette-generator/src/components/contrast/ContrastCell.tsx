'use client'

import { useMemo } from 'react'
import { getApcaFontBreakdown, type ContrastResult } from '@/utils/palette'
import { Badge } from '@/components/shared/Badge'

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
      <div
        className="rounded-lg text-center"
        style={{
          backgroundColor: bgColor,
          color: fgColor,
          padding: '8px 12px',
          border: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <span
          style={{
            fontSize: '20px',
            fontWeight: 700,
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}
        >
          Aa
        </span>
      </div>

      <div
        className="font-medium"
        style={{ fontSize: '10px', color: '#6b7280', letterSpacing: '0.03em' }}
      >
        {label}
      </div>

      <div className="flex items-center gap-1 flex-wrap">
        <span
          className="font-semibold"
          style={{
            fontFamily: 'var(--font-geist-mono, monospace)',
            fontSize: '12px',
          }}
        >
          {data.wcag}:1
        </span>
        <Badge pass={data.aa} label="AA" />
        <Badge pass={data.aaa} label="AAA" />
      </div>

      <div style={{ marginTop: '4px' }}>
        <div className="flex items-center gap-1" style={{ marginBottom: '4px' }}>
          <span style={{ fontSize: '10px', color: '#6b7280' }}>APCA</span>
          <span
            className="font-semibold"
            style={{
              fontFamily: 'var(--font-geist-mono, monospace)',
              fontSize: '12px',
            }}
          >
            Lc&nbsp;{data.apca}
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {fontBreakdown.map(({ size, minWeightName }) => (
            <span
              key={size}
              className="inline-flex items-center rounded font-medium"
              style={{
                padding: '2px 6px',
                fontSize: '10px',
                lineHeight: '16px',
                fontFamily: 'var(--font-geist-mono, monospace)',
                backgroundColor: minWeightName ? '#dbeafe' : '#f3f4f6',
                color: minWeightName ? '#1e40af' : '#c0c0c0',
                textDecoration: minWeightName ? 'none' : 'line-through',
              }}
            >
              {size}px{minWeightName ? ` ${minWeightName}` : ''}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
