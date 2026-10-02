// @vitest-environment jsdom
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ContrastTable } from './ContrastTable'
import { renderWithProviders } from '@/test/renderWithProviders'
import { buildContrastGrid } from '@/utils/contrastTable'
import type { ContrastGrid } from '@/utils/contrastTable'
import { TS_TONE_HUE, hueDisplayName } from '@/config/tokensStudio'
import type { Scheme } from '@/config/tokensStudio'
import { tokensStudioPalettes } from '@/utils/semanticTokens'

function renderTable(
  activePaletteIndex = 0,
  palettes = tokensStudioPalettes('light'),
  scheme: Scheme = 'light',
) {
  const onActivePaletteChange = vi.fn()
  renderWithProviders(
    <ContrastTable
      palettes={palettes}
      activePaletteIndex={activePaletteIndex}
      onActivePaletteChange={onActivePaletteChange}
    />,
    { scheme },
  )
  return { onActivePaletteChange }
}

/** The cell title the table writes for a row and column. */
function cellTitle(grid: ContrastGrid, rowPath: string, columnPath: string) {
  const row = grid.rows.find((r) => r.path === rowPath)
  const cell = row?.cells.find((c) => c.column.path === columnPath)
  if (!row || !cell) throw new Error(`No cell ${rowPath} × ${columnPath}`)
  return {
    cell,
    title: [
      `${row.role} on ${cell.column.role}`,
      `APCA Lc ${cell.lc}`,
      `WCAG ${cell.wcag}:1`,
      cell.check
        ? `ADR 0016 target Lc ${cell.check.target}: ${cell.check.pass ? 'pass' : 'fail'}`
        : '',
    ]
      .filter(Boolean)
      .join(' · '),
  }
}

function gridFor(scheme: Scheme, activeIndex = 0) {
  const palettes = tokensStudioPalettes(scheme)
  return buildContrastGrid(palettes, palettes[activeIndex], scheme)
}

describe('ContrastTable', () => {
  describe('Rendering', () => {
    it('renders a row per text role and a cell per background role', () => {
      renderTable()

      const grid = gridFor('light')
      const table = within(
        screen.getByRole('region', { name: 'Contrast table' }),
      ).getByRole('table')
      for (const row of grid.rows) {
        expect(within(table).getByText(row.role)).toBeInTheDocument()
      }
      expect(within(table).getAllByText(/^Lc -?\d/)).toHaveLength(
        grid.rows.length * grid.columns.length,
      )
    })

    it('shows APCA Lc and the WCAG ratio for text.primary on the surface', () => {
      renderTable()

      const { cell, title } = cellTitle(
        gridFor('light'),
        'text.primary',
        'background.surface',
      )
      const td = screen.getByTitle(title)
      expect(td).toHaveTextContent(`Lc ${cell.lc}`)
      expect(td).toHaveTextContent(`${cell.wcag}:1`)
      expect(cell.check).toBeDefined()
      expect(td).toHaveTextContent(
        `target ${cell.check?.target}: ${cell.check?.pass ? 'pass' : 'fail'}`,
      )
    })

    it('uses the active palette for the per-tone roles', () => {
      renderTable(3)

      const grid = gridFor('light', 3)
      const { cell, title } = cellTitle(
        grid,
        'text.on-emphasis.accent',
        'background.interactive.accent.emphasis.default',
      )
      expect(screen.getByTitle(title)).toHaveTextContent(`Lc ${cell.lc}`)
    })

    it('follows the dark colour scheme', () => {
      renderTable(0, tokensStudioPalettes('dark'), 'dark')

      const grid = gridFor('dark')
      const { cell, title } = cellTitle(
        grid,
        'text.primary',
        'background.surface',
      )
      expect(screen.getByTitle(title)).toHaveTextContent(`Lc ${cell.lc}`)
      // Neutral roles come from the dark scheme's neutral hue
      const row = grid.rows.find((r) => r.path === 'text.primary')
      expect(row?.paletteName).toBe(hueDisplayName(TS_TONE_HUE.dark.neutral))
      expect(
        screen.getAllByText(`${row?.paletteName}/${row?.step}`).length,
      ).toBeGreaterThan(0)
    })

    it('renders nothing for an index outside the palettes', () => {
      renderTable(99)

      expect(screen.queryByRole('table')).not.toBeInTheDocument()
    })

    it('leaves out the palette switch for a single palette', () => {
      renderTable(0, tokensStudioPalettes('light').slice(0, 1))

      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(
        screen.queryByRole('radiogroup', { name: 'Palette' }),
      ).not.toBeInTheDocument()
    })
  })

  describe('Behaviour', () => {
    it('offers every palette and marks the active one', () => {
      const palettes = tokensStudioPalettes('light')
      renderTable(1)

      const group = screen.getByRole('radiogroup', { name: 'Palette' })
      const radios = within(group).getAllByRole('radio')
      expect(radios.map((r) => r.textContent)).toEqual(
        palettes.map((p) => p.name),
      )
      expect(radios[1]).toBeChecked()
    })

    it('calls onActivePaletteChange with the chosen index', async () => {
      const user = userEvent.setup()
      const palettes = tokensStudioPalettes('light')
      const { onActivePaletteChange } = renderTable()

      await user.click(screen.getByRole('radio', { name: palettes[2].name }))

      expect(onActivePaletteChange).toHaveBeenCalledWith(2)
    })
  })
})
