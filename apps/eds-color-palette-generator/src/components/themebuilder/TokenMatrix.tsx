'use client'

import { useMemo } from 'react'
import { contrast } from '@/utils/color'
import { STEP_ROLES } from '@/utils/palette'
import { CATEGORY_GROUPS } from '@/config/categories'

type GeneratedPalette = {
  name: string
  steps: string[]
}

type TokenMatrixProps = {
  palettes: GeneratedPalette[]
}

function getTextColor(bgHex: string): string {
  const whiteContrast = parseFloat(
    String(
      contrast({
        foreground: '#ffffff',
        background: bgHex,
        algorithm: 'WCAG21',
        silent: true,
      }),
    ),
  )
  return whiteContrast >= 3 ? '#fff' : '#000'
}

export function TokenMatrix({ palettes }: TokenMatrixProps) {
  if (palettes.length === 0) return null

  return (
    <section className="rounded-xl overflow-hidden border border-neutral-subtle bg-default">
      <h2 className="font-semibold text-sm px-5 pt-4">Token Matrix</h2>

      <div className="px-5 pb-5 pt-3 overflow-x-auto">
        {/* Category group headers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(100px, auto) repeat(15, minmax(48px, 1fr))',
            gap: '2px',
          }}
        >
          {/* Spacer for row label column */}
          <div />
          {CATEGORY_GROUPS.map((group) => (
            <div
              key={group.label}
              className="text-center text-subtle"
              style={{
                gridColumn: `span ${group.span}`,
                paddingBottom: '4px',
                fontSize: '10px',
                whiteSpace: 'nowrap',
              }}
            >
              {group.label}
              <div
                className="border-t border-neutral-subtle"
                style={{ marginTop: '2px' }}
              />
            </div>
          ))}

          {/* Step number headers */}
          <div />
          {STEP_ROLES.map((role, i) => (
            <div
              key={role}
              className="text-center text-subtle"
              style={{ fontSize: '10px', paddingBottom: '4px' }}
              title={role}
            >
              {i + 1}
            </div>
          ))}

          {/* Palette rows */}
          {palettes.map((palette) => (
            <PaletteRow key={palette.name} palette={palette} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PaletteRow({ palette }: { palette: GeneratedPalette }) {
  const textColors = useMemo(
    () => palette.steps.map(getTextColor),
    [palette.steps],
  )

  return (
    <>
      <div
        className="flex items-center text-xs font-semibold"
        style={{ paddingRight: '8px', whiteSpace: 'nowrap' }}
      >
        {palette.name}
      </div>
      {palette.steps.map((hex, i) => (
        <div
          key={`${palette.name}-${i}`}
          className="flex items-center justify-center"
          style={{
            backgroundColor: hex,
            color: textColors[i],
            height: '44px',
            borderRadius:
              i === 0
                ? '8px 0 0 8px'
                : i === palette.steps.length - 1
                  ? '0 8px 8px 0'
                  : undefined,
            fontSize: '10px',
            fontWeight: 600,
            cursor: 'default',
          }}
          title={`${i + 1}. ${STEP_ROLES[i]}: ${hex}`}
        >
          {i + 1}
        </div>
      ))}
    </>
  )
}
