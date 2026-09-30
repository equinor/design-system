'use client'

import { useMemo } from 'react'
import { Badge } from '@/components/shared/Badge'
import { useColorScheme } from '@/context/ColorSchemeContext'
import {
  CONTRAST_COLUMN_GROUPS,
  buildContrastGrid,
  type ResolvedEntry,
} from '@/utils/contrastTable'

type GeneratedPalette = {
  name: string
  steps: string[]
}

type ContrastTableProps = {
  palettes: GeneratedPalette[]
  activePaletteIndex: number
  onActivePaletteChange: (index: number) => void
}

/** `12`, or `Gray/13` when the colour comes from another palette. */
function stepSource(entry: ResolvedEntry): string {
  return entry.fromActive
    ? String(entry.step)
    : `${entry.paletteName}/${entry.step}`
}

const GROUP_SEPARATOR =
  '1px solid var(--eds-color-border-neutral-subtle, #e5e7eb)'

/**
 * APCA contrast (ADR 0016) of Tokens Studio text roles on the background
 * roles of the active palette. The active palette plays `<tone>`; neutral and
 * link roles come from the palettes that play those tones.
 */
export function ContrastTable({
  palettes,
  activePaletteIndex,
  onActivePaletteChange,
}: ContrastTableProps) {
  const { colorScheme } = useColorScheme()
  const palette = palettes[activePaletteIndex]

  const grid = useMemo(
    () =>
      palette ? buildContrastGrid(palettes, palette, colorScheme) : undefined,
    [palettes, palette, colorScheme],
  )

  if (!palette || !grid) return null

  return (
    <section className="rounded-xl overflow-hidden border border-neutral-subtle bg-default">
      <div className="flex items-center justify-between px-5 pt-4">
        <h2 className="font-semibold text-sm m-0">Contrast Table</h2>

        {palettes.length > 1 && (
          <div className="flex items-center gap-2">
            {palettes.map((p, i) => (
              <button
                key={i}
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
            {/* Group headers — Tokens Studio background roles */}
            <tr>
              <th
                className="border-b border-neutral-subtle"
                style={{ padding: '6px 8px' }}
              />
              {CONTRAST_COLUMN_GROUPS.map((group) => (
                <th
                  key={group.group}
                  colSpan={
                    grid.columns.filter((c) => c.group === group.group).length
                  }
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
                text \ background
              </th>
              {grid.columns.map((col) => (
                <th
                  key={col.path}
                  className="text-center text-subtle font-medium border-b border-neutral-subtle"
                  style={{
                    padding: '6px 4px',
                    whiteSpace: 'nowrap',
                    fontSize: '9px',
                    borderLeft: col.firstInGroup ? GROUP_SEPARATOR : undefined,
                  }}
                  title={`${col.role} · ${col.paletteName} step ${col.step} (${col.hex})`}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span
                      style={{
                        display: 'inline-block',
                        width: '14px',
                        height: '14px',
                        borderRadius: '3px',
                        backgroundColor: col.hex,
                        border: '1px solid rgba(128,128,128,0.2)',
                      }}
                    />
                    <span>{col.label}</span>
                    <span style={{ opacity: 0.6 }}>{stepSource(col)}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.rows.map((row) => (
              <tr key={row.path}>
                <td
                  className="font-medium border-b border-neutral-subtle/50"
                  style={{
                    padding: '6px 8px',
                    whiteSpace: 'nowrap',
                  }}
                  title={`${row.role} · ${row.paletteName} step ${row.step} (${row.hex})`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      style={{
                        display: 'inline-block',
                        width: '14px',
                        height: '14px',
                        borderRadius: '3px',
                        backgroundColor: row.hex,
                        border: '1px solid rgba(128,128,128,0.2)',
                        flexShrink: 0,
                      }}
                    />
                    <span className="text-strong" style={{ fontSize: '11px' }}>
                      {row.role}
                    </span>
                    <span className="text-subtle" style={{ fontSize: '9px' }}>
                      {stepSource(row)}
                    </span>
                  </div>
                </td>
                {row.cells.map((cell) => (
                  <td
                    key={cell.column.path}
                    className="text-center border-b border-neutral-subtle/50"
                    style={{
                      padding: '4px',
                      borderLeft: cell.column.firstInGroup
                        ? GROUP_SEPARATOR
                        : undefined,
                      // ADR 0016 checks this pair: outline it
                      outline: cell.check
                        ? '2px solid currentColor'
                        : undefined,
                      outlineOffset: cell.check ? '-2px' : undefined,
                    }}
                    title={[
                      `${row.role} on ${cell.column.role}`,
                      `APCA Lc ${cell.lc}`,
                      `WCAG ${cell.wcag}:1`,
                      cell.check
                        ? `ADR 0016 target Lc ${cell.check.target}: ${cell.check.pass ? 'pass' : 'fail'}`
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span
                        className="text-strong font-mono font-semibold"
                        style={{ fontSize: '11px' }}
                      >
                        Lc {cell.lc}
                      </span>
                      <Badge
                        pass={cell.level.kind !== 'fail'}
                        label={cell.level.label}
                        variant={
                          cell.level.kind === 'level' ? 'level' : 'pass-fail'
                        }
                      />
                      <span
                        className="text-subtle font-mono"
                        style={{ fontSize: '9px' }}
                      >
                        {cell.wcag}:1
                      </span>
                      {cell.check && (
                        <span
                          className="text-strong font-semibold"
                          style={{ fontSize: '9px', whiteSpace: 'nowrap' }}
                        >
                          target {cell.check.target}:{' '}
                          {cell.check.pass ? 'pass' : 'fail'}
                        </span>
                      )}
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
