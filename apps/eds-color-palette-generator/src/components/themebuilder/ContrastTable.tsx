'use client'

import { useMemo } from 'react'
import { calcContrast } from '@/utils/palette'
import { STEP_ROLES } from '@/utils/palette'
import { Badge } from '@/components/Badge'

type GeneratedPalette = {
  name: string
  steps: string[]
}

type ContrastTableProps = {
  palettes: GeneratedPalette[]
  activePaletteIndex: number
  onActivePaletteChange: (index: number) => void
}

// Background column indices (steps 1-5, 9-11 → 0-indexed)
const BG_INDICES = [0, 1, 2, 3, 4, 8, 9, 10]
// Foreground row indices (border 6-8, text 12-15 → 0-indexed)
const FG_INDICES = [5, 6, 7, 11, 12, 13, 14]

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
  if (!palette) return null

  const grid = useMemo(() => {
    return FG_INDICES.map((fgIdx) => ({
      fgIdx,
      fgRole: STEP_ROLES[fgIdx],
      fgHex: palette.steps[fgIdx],
      cells: BG_INDICES.map((bgIdx) => {
        const result = calcContrast(palette.steps[fgIdx], palette.steps[bgIdx])
        const wcagNum = parseFloat(result.wcag)
        const level = getContrastLevel(wcagNum)
        return {
          bgIdx,
          bgRole: STEP_ROLES[bgIdx],
          wcag: result.wcag,
          level,
        }
      }),
    }))
  }, [palette])

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
            <tr>
              <th
                className="text-left text-subtle font-semibold border-b border-neutral-subtle"
                style={{ padding: '6px 8px' }}
              >
                fg \ bg
              </th>
              {BG_INDICES.map((bgIdx) => (
                <th
                  key={bgIdx}
                  className="text-center text-subtle font-medium border-b border-neutral-subtle"
                  style={{
                    padding: '6px 4px',
                    whiteSpace: 'nowrap',
                    fontSize: '9px',
                  }}
                  title={STEP_ROLES[bgIdx]}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span
                      style={{
                        display: 'inline-block',
                        width: '14px',
                        height: '14px',
                        borderRadius: '3px',
                        backgroundColor: palette.steps[bgIdx],
                        border: '1px solid rgba(128,128,128,0.2)',
                      }}
                    />
                    <span>{bgIdx + 1}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row) => (
              <tr key={row.fgIdx}>
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
                    <span className="text-subtle" style={{ fontSize: '10px' }}>
                      {row.fgIdx + 1}. {row.fgRole}
                    </span>
                  </div>
                </td>
                {row.cells.map((cell) => (
                  <td
                    key={cell.bgIdx}
                    className="text-center border-b border-neutral-subtle/50"
                    style={{ padding: '4px' }}
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
