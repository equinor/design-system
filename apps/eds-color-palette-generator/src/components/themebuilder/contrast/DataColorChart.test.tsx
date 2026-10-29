// @vitest-environment jsdom
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { DataColorChart } from './DataColorChart'
import { renderWithProviders } from '@/test/renderWithProviders'
import { tokensStudioPalettes } from '@/utils/semanticTokens'

const PALETTES = tokensStudioPalettes('light').slice(0, 4)

const chart = () => screen.getByRole('region', { name: 'Data colour chart' })

describe('DataColorChart', () => {
  describe('Rendering', () => {
    it('shows a series per palette in palette mode', () => {
      renderWithProviders(<DataColorChart palettes={PALETTES} />)

      for (const p of PALETTES) {
        expect(within(chart()).getAllByText(p.name).length).toBeGreaterThan(0)
      }
      expect(
        within(chart()).getByRole('checkbox', { name: 'Monochromatic' }),
      ).not.toBeChecked()
      expect(
        within(chart()).getByRole('combobox', { name: 'Chart bg' }),
      ).toBeInTheDocument()
      expect(
        within(chart()).getByRole('heading', {
          name: 'Colour-to-colour contrast',
        }),
      ).toBeInTheDocument()
    })

    it('gives every column header of the colour-to-colour table a name', () => {
      renderWithProviders(<DataColorChart palettes={PALETTES} />)

      const table = within(chart()).getByRole('table')
      for (const header of within(table).getAllByRole('columnheader')) {
        expect(header).toHaveAccessibleName()
      }
    })

    it('heads every row of the colour-to-colour table with its colour', () => {
      renderWithProviders(<DataColorChart palettes={PALETTES} />)

      const table = within(chart()).getByRole('table')
      expect(
        within(table)
          .getAllByRole('rowheader')
          .map((header) => header.textContent),
      ).toEqual(PALETTES.map((p) => p.name))
    })

    it('renders the given colours in direct mode without the palette controls', () => {
      const colors = [
        { name: 'First', hex: PALETTES[0].steps[8] },
        { name: 'Second', hex: PALETTES[1].steps[8] },
      ]
      renderWithProviders(
        <DataColorChart
          colors={colors}
          bgHex={PALETTES[0].steps[0]}
          textHex={PALETTES[0].steps[12]}
          pairwiseCheck={false}
        />,
      )

      expect(within(chart()).getAllByText('First').length).toBeGreaterThan(0)
      expect(
        screen.queryByRole('checkbox', { name: 'Monochromatic' }),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('combobox', { name: 'Chart bg' }),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('heading', { name: 'Colour-to-colour contrast' }),
      ).not.toBeInTheDocument()
    })
  })

  describe('Behaviour', () => {
    it('shows shades of one palette in monochromatic mode', async () => {
      const user = userEvent.setup()
      renderWithProviders(<DataColorChart palettes={PALETTES} />)

      await user.click(screen.getByRole('checkbox', { name: 'Monochromatic' }))

      const select = screen.getByRole('combobox', { name: 'Palette' })
      expect(select).toHaveDisplayValue(PALETTES[0].name)
      expect(
        within(chart()).getAllByText(`${PALETTES[0].name}/9`).length,
      ).toBeGreaterThan(0)

      await user.selectOptions(select, PALETTES[2].name)

      expect(
        within(chart()).getAllByText(`${PALETTES[2].name}/9`).length,
      ).toBeGreaterThan(0)
    })

    it('switches the chart type', async () => {
      const user = userEvent.setup()
      renderWithProviders(<DataColorChart palettes={PALETTES} />)
      const types = screen.getByRole('radiogroup', { name: 'Chart type' })

      await user.click(within(types).getByRole('radio', { name: 'Line' }))

      expect(within(types).getByRole('radio', { name: 'Line' })).toBeChecked()
      expect(screen.getByText('Mon')).toBeInTheDocument()
    })

    it('gives every colour its own donut segment with more than five colours', async () => {
      const user = userEvent.setup()
      const palettes = tokensStudioPalettes('light')
      const { container } = renderWithProviders(
        <DataColorChart palettes={palettes} />,
      )

      await user.click(
        within(
          screen.getByRole('radiogroup', { name: 'Chart type' }),
        ).getByRole('radio', { name: 'Donut' }),
      )

      // The segments are SVG circles, which have no role. Each one starts
      // where the one before it ends, so lengths adding up to the whole
      // circle means no segment covers another.
      const segments = [...container.querySelectorAll('circle')]
      expect(palettes.length).toBeGreaterThan(5)
      expect(segments).toHaveLength(palettes.length)
      const lengths = segments.map((segment) =>
        Number(segment.getAttribute('stroke-dasharray')?.split(' ')[0]),
      )
      expect(lengths.reduce((a, b) => a + b, 0)).toBeCloseTo(100)
    })

    it('keeps the donut patterns of two charts apart', async () => {
      const user = userEvent.setup()
      const { container } = renderWithProviders(
        <>
          <DataColorChart palettes={PALETTES} />
          <DataColorChart palettes={PALETTES} />
        </>,
      )

      for (const types of screen.getAllByRole('radiogroup', {
        name: 'Chart type',
      })) {
        await user.click(within(types).getByRole('radio', { name: 'Donut' }))
      }
      for (const box of screen.getAllByRole('checkbox', {
        name: 'Show patterns',
      })) {
        await user.click(box)
      }

      const ids = [...container.querySelectorAll('pattern')].map((p) => p.id)
      expect(ids).toHaveLength(PALETTES.length * 2)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('applies a colour vision simulation to the preview', async () => {
      const user = userEvent.setup()
      const { container } = renderWithProviders(
        <DataColorChart palettes={PALETTES} />,
      )

      await user.selectOptions(
        screen.getByRole('combobox', { name: 'Vision' }),
        'protanopia',
      )

      // The SVG filter has no role; check that it is defined and applied.
      expect(container.querySelector('filter#cvd-protanopia')).not.toBeNull()
      expect(
        container.querySelector('[style*="url(#cvd-protanopia)"]'),
      ).not.toBeNull()
    })
  })
})
