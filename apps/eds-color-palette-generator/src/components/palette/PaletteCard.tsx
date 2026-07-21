'use client'

import Color from 'colorjs.io'
import { contrast } from '@/utils/color'
import { STEP_ROLES, type TokenPalette } from '@/utils/palette'

export type PaletteViewMode = 'curve' | 'gradient'

const CATEGORY_GROUPS = [
  { label: 'Background', span: 2 },
  { label: 'Background Fill Muted', span: 3 },
  { label: 'Border', span: 3 },
  { label: 'Background Fill Emphasis', span: 3 },
  { label: 'Text', span: 4 },
] as const

function getLightness(hex: string): number {
  try {
    return new Color(hex).to('oklch').l ?? 0
  } catch {
    return 0
  }
}

function labelColor(hex: string): string {
  try {
    const wcag = parseFloat(
      String(
        contrast({
          foreground: '#ffffff',
          background: hex,
          algorithm: 'WCAG21',
          silent: true,
        }),
      ),
    )
    return wcag >= 3 ? '#fff' : '#000'
  } catch {
    return '#000'
  }
}

function isValidHex(v: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(v)
}

export function PaletteCard({
  palette,
  index,
  viewMode,
  onNameChange,
  onRemove,
  onStepChange,
}: {
  palette: TokenPalette
  index: number
  viewMode: PaletteViewMode
  onNameChange: (index: number, name: string) => void
  onRemove: (index: number) => void
  onStepChange: (paletteIndex: number, stepIndex: number, hex: string) => void
}) {
  const sorted =
    viewMode === 'curve'
      ? palette.steps.map((hex, i) => ({ hex, i }))
      : palette.steps
          .map((hex, i) => ({ hex, i }))
          .sort((a, b) => getLightness(b.hex) - getLightness(a.hex))

  return (
    <section
      className="rounded-xl overflow-hidden"
      style={{
        border: '1px solid #e5e7eb',
        background: '#fff',
      }}
    >
      {/* Palette header */}
      <div
        className="flex items-center gap-3"
        style={{
          padding: '12px 20px',
          borderBottom: '1px solid #f3f4f6',
        }}
      >
        <input
          type="text"
          value={palette.name}
          onChange={(e) => onNameChange(index, e.target.value)}
          style={{
            fontSize: '15px',
            fontWeight: 600,
            border: 'none',
            background: 'transparent',
            outline: 'none',
            padding: '4px 0',
            width: '200px',
          }}
        />
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="ml-auto cursor-pointer"
          style={{
            padding: '4px 10px',
            fontSize: '11px',
            borderRadius: '6px',
            border: '1.5px solid #fecaca',
            background: '#fff',
            color: '#dc2626',
          }}
        >
          Remove
        </button>
      </div>

      {/* Color strip */}
      <div style={{ padding: '16px 20px 0' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(15, 1fr)',
            gap: '2px',
          }}
        >
          {/* Category group headers (curve mode only) */}
          {viewMode === 'curve' &&
            CATEGORY_GROUPS.map((group) => (
              <div
                key={group.label}
                className="text-center"
                style={{
                  gridColumn: `span ${group.span}`,
                  paddingBottom: '6px',
                }}
              >
                <span style={{ fontSize: '10px', color: '#6b7280' }}>
                  {group.label}
                </span>
                <div
                  style={{
                    height: '1px',
                    background: '#d1d5db',
                    marginTop: '3px',
                  }}
                />
              </div>
            ))}

          {/* Swatch cells */}
          {sorted.map(({ hex, i: origIdx }, displayIdx) => (
            <div
              key={`strip-${origIdx}`}
              className="flex flex-col items-center justify-end"
              style={{
                height: '64px',
                backgroundColor: hex,
                paddingBottom: '4px',
                borderRadius:
                  displayIdx === 0
                    ? '10px 0 0 10px'
                    : displayIdx === 14
                      ? '0 10px 10px 0'
                      : undefined,
              }}
              title={`${origIdx + 1}. ${STEP_ROLES[origIdx]}: ${hex}`}
            >
              <span
                className="font-bold"
                style={{
                  fontSize: '10px',
                  color: labelColor(hex),
                  opacity: 0.9,
                }}
              >
                {origIdx + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hex input grid */}
      <div
        style={{
          padding: '16px 20px 20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '8px',
        }}
      >
        {sorted.map(({ hex, i: origIdx }) => (
          <div key={`input-${origIdx}`}>
            <label
              style={{
                display: 'block',
                fontSize: '10px',
                color: '#6b7280',
                marginBottom: '3px',
                lineHeight: 1.3,
              }}
            >
              <strong style={{ color: '#374151' }}>{origIdx + 1}</strong>{' '}
              {STEP_ROLES[origIdx]}
            </label>
            <div className="flex items-center gap-1">
              <span
                style={{
                  display: 'inline-block',
                  width: '16px',
                  height: '16px',
                  borderRadius: '4px',
                  backgroundColor: hex,
                  border: '1px solid rgba(0,0,0,0.1)',
                  flexShrink: 0,
                }}
              />
              <input
                type="text"
                value={hex}
                onChange={(e) => {
                  const v = e.target.value
                  onStepChange(index, origIdx, v)
                }}
                style={{
                  fontSize: '12px',
                  fontFamily: 'var(--font-geist-mono, monospace)',
                  padding: '4px 6px',
                  borderRadius: '4px',
                  border: `1.5px solid ${isValidHex(hex) ? '#d1d5db' : '#fca5a5'}`,
                  background: '#fff',
                  width: '100%',
                  minWidth: 0,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
