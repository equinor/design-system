'use client'

import { useMemo } from 'react'
import { calcContrast } from '@/utils/palette'
import { STEP_ROLES } from '@/utils/palette'
import { Badge } from '@/components/shared/Badge'

type GeneratedPalette = {
  name: string
  steps: string[]
}

type ContrastTableProps = {
  palettes: GeneratedPalette[]
  activePaletteIndex: number
  onActivePaletteChange: (index: number) => void
}

/**
 * Background / surface tokens (contrast columns) as used in the EDS UI.
 * `step` is 1-indexed into the palette scale.
 */
const BG_GROUPS = [
  {
    group: 'accent / default',
    cols: [
      { label: 'default', step: 9 },
      { label: 'hover', step: 10 },
      { label: 'pressed', step: 11 },
    ],
  },
  {
    group: 'accent / subtle',
    cols: [
      { label: 'default', step: 1 },
      { label: 'hover', step: 2 },
      { label: 'pressed', step: 3 },
    ],
  },
  {
    group: 'accent / selected',
    cols: [
      { label: 'default', step: 4 },
      { label: 'hover', step: 5 },
      { label: 'pressed', step: 6 },
    ],
  },
] as const

const BG_COLUMNS = BG_GROUPS.flatMap((g) =>
  g.cols.map((c) => ({ ...c, group: g.group })),
)

/**
 * Text / foreground tokens (contrast rows) as named in the EDS UI.
 * `step` is 1-indexed into the palette scale. `source` decides which palette
 * the text color is pulled from: `'neutral'` (the Gray ramp — e.g. gray text
 * on an accent background) or `'accent'` (the active/surface palette).
 */
const FG_TOKENS = [
  { label: 'primary', step: 12, source: 'neutral' },
  { label: 'secondary', step: 8, source: 'neutral' },
  { label: 'muted', step: 7, source: 'neutral' },
  { label: 'disabled', step: 5, source: 'neutral' },
  { label: 'accent', step: 9, source: 'accent' },
  { label: 'pressed', step: 10, source: 'accent' },
  { label: 'on-accent', step: 14, source: 'neutral' },
  { label: 'color on dark', step: 15, source: 'neutral' },
  { label: 'color on light', step: 12, source: 'neutral' },
] as const

function getContrastLevel(
  wcagRatio: number,
): { label: string; pass: boolean } {
  if (wcagRatio >= 7) return { label: 'AAA', pass: true }
  if (wcagRatio >= 4.5) return { label: 'AA', pass: true }
  if (wcagRatio >= 3) return { label: 'AA18', pass: true }
  if (wcagRatio >= 1.5) return { label: 'DECO', pass: true }
  return { label: 'FAIL', pass: false }
}

export function ContrastTable({
  palettes,
  activePaletteIndex,
  onActivePaletteChange,
}: ContrastTableProps) {
  const palette = palettes[activePaletteIndex]

  // Neutral text (primary/secondary/muted/…) is pulled from the Gray ramp when
  // one exists, so we can check e.g. gray text on an accent surface. Falls back
  // to the active palette when there is no Gray palette.
  const neutralPalette = useMemo(
    () => palettes.find((p) => /^gr[ae]y$/i.test(p.name.trim())) ?? palette,
    [palettes, palette],
  )

  const grid = useMemo(() => {
    if (!palette) return []
    return FG_TOKENS.map((fg) => {
      const fgPalette = fg.source === 'neutral' ? neutralPalette : palette
      const fgHex = fgPalette.steps[fg.step - 1]
      return {
        ...fg,
        fgHex,
        fgPaletteName: fgPalette.name,
        crossPalette: fgPalette !== palette,
        cells: BG_COLUMNS.map((bg) => {
          const bgHex = palette.steps[bg.step - 1]
          const result = calcContrast(fgHex, bgHex)
          const level = getContrastLevel(parseFloat(result.wcag))
          return { ...bg, bgHex, wcag: result.wcag, level }
        }),
      }
    })
  }, [palette, neutralPalette])

  if (!palette) return null

  return (
    <section className="rounded-xl overflow-hidden border border-neutral-subtle bg-default">
      <div className="flex items-center justify-between px-5 pt-4">
        <h2 className="font-semibold text-sm m-0">Contrast Table</h2>

        {palettes.length > 1 && (
          <div className="flex items-center gap-2">
            {palettes.map((p, i) => (
              <button
                key={p.name}
                type="button"
                onClick={() => onActivePaletteChange(i)}
                className={[
                  'cursor-pointer px-2.5 py-1 text-xs rounded-md border',
                  activePaletteIndex === i
                    ? 'bg-neutral-fill-emphasis-default text-strong-on-emphasis font-semibold border-transparent'
                    : 'bg-default text-strong font-normal border-neutral-subtle',
                ].join(' ')}
              >
                {p.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 pb-5 pt-3 overflow-x-auto">
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '11px',
          }}
        >
          <thead>
            {/* Group headers — background/surface token families */}
            <tr>
              <th
                className="border-b border-neutral-subtle"
                style={{ padding: '6px 8px' }}
              />
              {BG_GROUPS.map((group) => (
                <th
                  key={group.group}
                  colSpan={group.cols.length}
                  className="text-center text-subtle font-semibold border-b border-l border-neutral-subtle"
                  style={{
                    padding: '6px 4px',
                    whiteSpace: 'nowrap',
                    fontSize: '9px',
                  }}
                >
                  {group.group}
                </th>
              ))}
            </tr>
            {/* State + swatch + step per background column */}
            <tr>
              <th
                className="text-left text-subtle font-semibold border-b border-neutral-subtle"
                style={{ padding: '6px 8px' }}
              >
                text \ surface
              </th>
              {BG_COLUMNS.map((col, i) => (
                <th
                  key={`${col.group}-${col.label}`}
                  className="text-center text-subtle font-medium border-b border-neutral-subtle"
                  style={{
                    padding: '6px 4px',
                    whiteSpace: 'nowrap',
                    fontSize: '9px',
                    borderLeft:
                      i % 3 === 0
                        ? '1px solid var(--eds-color-border-neutral-subtle, #e5e7eb)'
                        : undefined,
                  }}
                  title={`${col.group} / ${col.label} — ${STEP_ROLES[col.step - 1]}`}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span
                      style={{
                        display: 'inline-block',
                        width: '14px',
                        height: '14px',
                        borderRadius: '3px',
                        backgroundColor: palette.steps[col.step - 1],
                        border: '1px solid rgba(128,128,128,0.2)',
                      }}
                    />
                    <span>{col.label}</span>
                    <span style={{ opacity: 0.6 }}>{col.step}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row) => (
              <tr key={row.label}>
                <td
                  className="font-medium border-b border-neutral-subtle/50"
                  style={{
                    padding: '6px 8px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      style={{
                        display: 'inline-block',
                        width: '14px',
                        height: '14px',
                        borderRadius: '3px',
                        backgroundColor: row.fgHex,
                        border: '1px solid rgba(128,128,128,0.2)',
                        flexShrink: 0,
                      }}
                    />
                    <span className="text-strong" style={{ fontSize: '11px' }}>
                      {row.label}
                    </span>
                    <span className="text-subtle" style={{ fontSize: '9px' }}>
                      {row.crossPalette
                        ? `${row.fgPaletteName}/${row.step}`
                        : row.step}
                    </span>
                  </div>
                </td>
                {row.cells.map((cell, i) => (
                  <td
                    key={`${cell.group}-${cell.label}`}
                    className="text-center border-b border-neutral-subtle/50"
                    style={{
                      padding: '4px',
                      borderLeft:
                        i % 3 === 0
                          ? '1px solid var(--eds-color-border-neutral-subtle, #e5e7eb)'
                          : undefined,
                    }}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <Badge
                        pass={cell.level.pass}
                        label={cell.level.label}
                        variant={
                          cell.level.label === 'DECO' ||
                          cell.level.label === 'AA18'
                            ? 'level'
                            : 'pass-fail'
                        }
                      />
                      <span
                        className="text-subtle font-mono"
                        style={{ fontSize: '9px' }}
                      >
                        {cell.wcag}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
