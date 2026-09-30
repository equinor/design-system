'use client'

import { useMemo } from 'react'
import { Badge } from '@/components/shared/Badge'
import { Card } from '@/components/shared/Card'
import { SegmentedControl } from '@/components/shared/SegmentedControl'
import type { SegmentedOption } from '@/components/shared/SegmentedControl'
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

/** A left border that separates the background-role groups. */
function groupSeparator(firstInGroup: boolean): string {
  return firstInGroup ? 'border-l border-muted' : ''
}

/** Palette picker options; the value is the palette index. */
function paletteOptions(
  palettes: GeneratedPalette[],
): SegmentedOption<string>[] {
  return palettes.map((p, i) => ({ value: String(i), label: p.name }))
}

const SWATCH = 'inline-block size-3.5 shrink-0 rounded-sm border border-muted'

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
    <Card
      title="Contrast table"
      actions={
        palettes.length > 1 && (
          <SegmentedControl
            mode="radio"
            aria-label="Palette"
            size="sm"
            options={paletteOptions(palettes)}
            value={String(activePaletteIndex)}
            onChange={(v) => onActivePaletteChange(Number(v))}
          />
        )
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            {/* Group headers — Tokens Studio background roles */}
            <tr>
              <th className="border-b border-muted px-2 py-1.5" />
              {CONTRAST_COLUMN_GROUPS.map((group) => (
                <th
                  key={group.group}
                  colSpan={
                    grid.columns.filter((c) => c.group === group.group).length
                  }
                  className="border-b border-l border-muted px-1 py-1.5 text-center text-xs font-medium whitespace-nowrap text-secondary"
                >
                  {group.group}
                </th>
              ))}
            </tr>
            {/* State + swatch + step per background column */}
            <tr>
              <th className="border-b border-muted px-2 py-1.5 text-left text-xs font-medium text-secondary">
                text \ background
              </th>
              {grid.columns.map((col) => (
                <th
                  key={col.path}
                  className={[
                    'border-b border-muted px-1 py-1.5 text-center text-xs font-normal whitespace-nowrap text-secondary',
                    groupSeparator(col.firstInGroup),
                  ].join(' ')}
                  title={`${col.role} · ${col.paletteName} step ${col.step} (${col.hex})`}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span
                      className={SWATCH}
                      style={{ backgroundColor: col.hex }}
                    />
                    <span>{col.label}</span>
                    <span className="opacity-60">{stepSource(col)}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.rows.map((row) => (
              <tr key={row.path}>
                <td
                  className="border-b border-muted px-2 py-1.5 font-medium whitespace-nowrap"
                  title={`${row.role} · ${row.paletteName} step ${row.step} (${row.hex})`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={SWATCH}
                      style={{ backgroundColor: row.hex }}
                    />
                    <span className="text-sm text-primary">{row.role}</span>
                    <span className="text-xs font-normal text-secondary">
                      {stepSource(row)}
                    </span>
                  </div>
                </td>
                {row.cells.map((cell) => (
                  <td
                    key={cell.column.path}
                    className={[
                      'border-b border-muted p-1 text-center',
                      groupSeparator(cell.column.firstInGroup),
                    ].join(' ')}
                    style={{
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
                      <span className="font-mono text-sm font-medium text-primary">
                        Lc {cell.lc}
                      </span>
                      <Badge
                        pass={cell.level.kind !== 'fail'}
                        label={cell.level.label}
                        variant={
                          cell.level.kind === 'level' ? 'level' : 'pass-fail'
                        }
                      />
                      <span className="font-mono text-xs text-secondary">
                        {cell.wcag}:1
                      </span>
                      {cell.check && (
                        <span className="text-xs font-medium whitespace-nowrap text-primary">
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
    </Card>
  )
}
