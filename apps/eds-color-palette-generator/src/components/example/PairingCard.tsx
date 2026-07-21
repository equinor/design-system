'use client'

import { useMemo } from 'react'
import { calcContrast, getApcaFontBreakdown } from '@/utils/palette'
import { Badge } from '@/components/shared/Badge'

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
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid #e5e7eb', background: '#fff' }}
    >
      {/* Visual preview */}
      <div
        style={{
          backgroundColor: bgHex,
          padding: type === 'border' ? '16px 20px' : '16px 12px',
        }}
      >
        {type === 'border' ? (
          <div
            style={{
              border: `2px solid ${fgHex}`,
              borderRadius: '8px',
              padding: '10px 12px',
              fontSize: '13px',
              color: '#9ca3af',
              backgroundColor: bgHex,
            }}
          >
            Placeholder
          </div>
        ) : (
          <div className="text-center">
            <span
              style={{
                fontSize: '24px',
                fontWeight: 700,
                fontFamily: 'Georgia, serif',
                color: fgHex,
              }}
            >
              Aa
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div
        style={{
          padding: '10px 12px',
          fontSize: '10px',
          color: '#6b7280',
        }}
      >
        {/* Variable labels */}
        <div style={{ marginBottom: '6px', lineHeight: 1.5 }}>
          <div>
            fg: <strong style={{ color: '#111' }}>{fgRole}</strong>
          </div>
          <div>
            bg: <strong style={{ color: '#111' }}>{bgRole}</strong>
          </div>
        </div>

        {/* WCAG */}
        <div
          className="flex items-center gap-1 flex-wrap"
          style={{ marginBottom: '4px' }}
        >
          <span
            className="font-semibold"
            style={{
              fontFamily: 'var(--font-geist-mono, monospace)',
              fontSize: '12px',
              color: '#111',
            }}
          >
            {result.wcag}:1
          </span>
          <Badge pass={result.aa} label="AA" />
          <Badge pass={result.aaa} label="AAA" />
        </div>

        {/* APCA */}
        <div className="flex items-center gap-1" style={{ marginBottom: '4px' }}>
          <span style={{ color: '#9ca3af' }}>APCA</span>
          <span
            className="font-semibold"
            style={{
              fontFamily: 'var(--font-geist-mono, monospace)',
              fontSize: '12px',
              color: '#111',
            }}
          >
            Lc&nbsp;{result.apca}
          </span>
        </div>

        {/* Font sizes */}
        <div className="flex flex-wrap gap-1">
          {fontBreakdown.map(({ size, minWeightName }) => (
            <span
              key={size}
              className="inline-flex items-center rounded font-medium"
              style={{
                padding: '1px 4px',
                fontSize: '9px',
                lineHeight: '14px',
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
