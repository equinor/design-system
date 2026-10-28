// @vitest-environment jsdom
import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TS_GAUSSIAN, TS_HUES, TS_SCALE } from '@/config/tokensStudio'
import { renderWithProviders } from '@/test/renderWithProviders'
import { AboutChromaDistribution } from './AboutChromaDistribution'

const ACCENT = TS_HUES[0]

const meanSlider = () => screen.getByRole('slider', { name: /^Mean/ })

/** The tooltip of a bar in the chart. SVG titles sit inside each rect. */
const barTitle = (container: HTMLElement, step: number) =>
  container.querySelectorAll('rect > title')[step - 1]?.textContent

describe('AboutChromaDistribution', () => {
  describe('Rendering', () => {
    it('renders the section the table of contents links to', () => {
      renderWithProviders(<AboutChromaDistribution />)

      const heading = screen.getByRole('heading', { level: 2, name: 'Try it' })
      expect(heading.closest('section')).toHaveAttribute(
        'id',
        'chroma-distribution',
      )
    })

    it('starts the demo from the accent anchor', () => {
      renderWithProviders(<AboutChromaDistribution />)

      expect(screen.getByRole('textbox', { name: 'Anchor' })).toHaveValue(
        ACCENT.anchor,
      )
      expect(
        screen.getByText(/^This demo generates a scale/),
      ).toHaveTextContent(`It starts from the ${ACCENT.name} anchor`)
    })
  })

  describe('Colour scheme', () => {
    it('uses the light lightness and curve in light mode', () => {
      const { container } = renderWithProviders(<AboutChromaDistribution />)

      expect(meanSlider()).toHaveValue(String(TS_GAUSSIAN.light.mean))
      expect(barTitle(container, 9)).toContain(
        `Step 9: L ${TS_SCALE.light[8]},`,
      )
    })

    it('uses the dark lightness and curve in dark mode', () => {
      const { container } = renderWithProviders(<AboutChromaDistribution />, {
        scheme: 'dark',
      })

      expect(meanSlider()).toHaveValue(String(TS_GAUSSIAN.dark.mean))
      expect(barTitle(container, 9)).toContain(`Step 9: L ${TS_SCALE.dark[8]},`)
    })

    it('starts again from the anchor when the scheme changes', () => {
      const { setColorScheme } = renderWithProviders(
        <AboutChromaDistribution />,
      )

      fireEvent.change(meanSlider(), { target: { value: '0.2' } })
      setColorScheme('dark')

      expect(meanSlider()).toHaveValue(String(TS_GAUSSIAN.dark.mean))
      expect(screen.getByRole('textbox', { name: 'Anchor' })).toHaveValue(
        ACCENT.anchor,
      )
    })
  })
})
