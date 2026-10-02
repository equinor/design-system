import { describe, expect, it } from 'vitest'
import { SCHEMES } from '@/config/tokensStudio'
import {
  ADR_CHECKS,
  CONTRAST_COLUMN_GROUPS,
  CONTRAST_ROW_PATHS,
  apcaLevel,
  buildContrastGrid,
} from './contrastTable'
import { tokensStudioPalettes } from './semanticTokens'

const HEX = /^#[0-9a-f]{6}$/i

const byName = (scheme: 'light' | 'dark', name: string) => {
  const palette = tokensStudioPalettes(scheme).find((p) => p.name === name)
  if (!palette) throw new Error(`No Tokens Studio palette ${name}`)
  return palette
}

describe('apcaLevel', () => {
  it('uses the APCA thresholds 90, 75, 60, 45 and 30', () => {
    expect(apcaLevel(95)).toEqual({ label: '90+', kind: 'pass' })
    expect(apcaLevel(90)).toEqual({ label: '90+', kind: 'pass' })
    expect(apcaLevel(80)).toEqual({ label: '75+', kind: 'pass' })
    expect(apcaLevel(60)).toEqual({ label: '60+', kind: 'pass' })
    expect(apcaLevel(59)).toEqual({ label: '45+', kind: 'level' })
    expect(apcaLevel(30)).toEqual({ label: '30+', kind: 'level' })
    expect(apcaLevel(29)).toEqual({ label: 'FAIL', kind: 'fail' })
  })

  it('treats negative (reverse polarity) Lc by magnitude', () => {
    expect(apcaLevel(-92).label).toBe('90+')
  })
})

describe('buildContrastGrid', () => {
  it.each(SCHEMES)('resolves every cell in %s', (scheme) => {
    const palettes = tokensStudioPalettes(scheme)
    const grid = buildContrastGrid(palettes, palettes[0], scheme)
    const columnCount = CONTRAST_COLUMN_GROUPS.flatMap((g) => g.columns).length
    expect(grid.columns).toHaveLength(columnCount)
    expect(grid.rows).toHaveLength(CONTRAST_ROW_PATHS.length)
    for (const column of grid.columns) expect(column.hex).toMatch(HEX)
    for (const row of grid.rows) {
      expect(row.hex).toMatch(HEX)
      expect(row.cells).toHaveLength(columnCount)
      for (const cell of row.cells) expect(Number.isFinite(cell.lc)).toBe(true)
    }
  })

  it('takes neutral rows from the scheme neutral and the rest from the active palette', () => {
    const light = tokensStudioPalettes('light')
    const blue = byName('light', 'Blue')
    const grid = buildContrastGrid(light, blue, 'light')

    const primary = grid.rows.find((r) => r.path === 'text.primary')
    expect(primary?.paletteName).toBe('Gray')
    expect(primary?.hex).toBe(byName('light', 'Gray').steps[12])

    const onEmphasis = grid.rows.find(
      (r) => r.path === 'text.on-emphasis.accent',
    )
    expect(onEmphasis?.role).toBe('text.on-emphasis.<tone>')
    expect(onEmphasis?.paletteName).toBe('Blue')
    expect(onEmphasis?.hex).toBe(blue.steps[14])

    const surface = grid.columns.find((c) => c.path === 'background.surface')
    expect(surface?.step).toBe(15)
    expect(surface?.fromActive).toBe(false)

    const mutedDefault = grid.columns.find(
      (c) => c.path === 'background.interactive.accent.muted.default',
    )
    expect(mutedDefault?.hex).toBe(blue.steps[0])
    expect(mutedDefault?.fromActive).toBe(true)
  })

  it('uses North Sea as the neutral in dark', () => {
    const dark = tokensStudioPalettes('dark')
    const grid = buildContrastGrid(dark, dark[0], 'dark')
    const canvas = grid.columns.find((c) => c.path === 'background.canvas')
    expect(canvas?.paletteName).toBe('North Sea')
  })

  it('falls back to the Tokens Studio neutral when no palette plays it', () => {
    const custom = { name: 'Custom', steps: byName('light', 'Red').steps }
    const grid = buildContrastGrid([custom], custom, 'light')
    const primary = grid.rows.find((r) => r.path === 'text.primary')
    expect(primary?.paletteName).toBe('Gray')
    expect(primary?.hex).toBe(byName('light', 'Gray').steps[12])
  })

  it('marks exactly the pairs ADR 0016 checks', () => {
    const palettes = tokensStudioPalettes('light')
    const grid = buildContrastGrid(palettes, palettes[0], 'light')
    const checked = grid.rows.flatMap((row) =>
      row.cells.filter((cell) => cell.check).map((cell) => ({ row, cell })),
    )
    expect(checked).toHaveLength(ADR_CHECKS.length)
    for (const { row, cell } of checked) {
      const adr = ADR_CHECKS.find(
        (c) => c.fg === row.path && c.bg === cell.column.path,
      )
      expect(cell.check?.target).toBe(adr?.lc)
      expect(cell.check?.pass).toBe(cell.lc >= (adr?.lc ?? Infinity))
    }
  })
})
