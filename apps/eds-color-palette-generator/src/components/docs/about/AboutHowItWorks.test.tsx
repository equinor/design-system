// @vitest-environment jsdom
import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  STEP_COUNT,
  TS_GAUSSIAN,
  TS_HUES,
  TS_SCALE,
  type Scheme,
} from '@/config/tokensStudio'
import { gaussian, generateColorScale } from '@/utils/color'
import { renderWithProviders } from '@/test/renderWithProviders'
import { AboutHowItWorks } from './AboutHowItWorks'

const ACCENT = TS_HUES[0]

/** The anchor as Tokens Studio writes it: `oklch(L C H)` */
function anchorParts(anchor: string) {
  const match = anchor.match(/^oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)$/)
  if (!match) throw new Error(`Unexpected anchor: ${anchor}`)
  const [l, c, h] = match.slice(1).map(Number)
  return { l, c, h }
}

/** What the worked example for step 9 should say in a scheme. */
function step9(scheme: Scheme) {
  const { mean, stdDev } = TS_GAUSSIAN[scheme]
  const l = TS_SCALE[scheme][8]
  const multiplier = gaussian(l, mean, stdDev)
  const { c } = anchorParts(ACCENT.anchor)
  return { l, mean, stdDev, multiplier, chroma: c * multiplier }
}

function workedExample() {
  return screen.getByText(/^Step 9 has L/)
}

describe('AboutHowItWorks', () => {
  describe('Rendering', () => {
    it('renders the section the table of contents links to', () => {
      renderWithProviders(<AboutHowItWorks />)

      const heading = screen.getByRole('heading', {
        level: 2,
        name: 'How a scale is made',
      })
      expect(heading.closest('section')).toHaveAttribute('id', 'how-it-works')
    })

    it('uses the accent hue, the first Tokens Studio hue, as the example', () => {
      renderWithProviders(<AboutHowItWorks />)

      expect(
        screen.getByRole('heading', {
          level: 3,
          name: `Example: ${ACCENT.name} in light mode`,
        }),
      ).toBeInTheDocument()
    })

    it('shows the accent anchor and its L, C and H', () => {
      renderWithProviders(<AboutHowItWorks />)

      const { l, c, h } = anchorParts(ACCENT.anchor)
      expect(screen.getByText(ACCENT.anchor)).toBeInTheDocument()
      expect(
        screen.getByText(
          `Anchor: L ${l.toFixed(3)}, C ${c.toFixed(3)}, H ${h.toFixed(1)}`,
        ),
      ).toBeInTheDocument()
    })
  })

  describe('Light mode', () => {
    it('works step 9 through with the light curve', () => {
      renderWithProviders(<AboutHowItWorks />)

      const { l, mean, stdDev, multiplier, chroma } = step9('light')
      const { c, h } = anchorParts(ACCENT.anchor)
      const text = workedExample()
      expect(text).toHaveTextContent(`Step 9 has L ${l}.`)
      expect(text).toHaveTextContent(
        `light mode has mean ${mean} and standard deviation ${stdDev}`,
      )
      expect(text).toHaveTextContent(
        `a multiplier of ${multiplier.toFixed(3)} at that lightness`,
      )
      expect(text).toHaveTextContent(
        `chroma ${c.toFixed(3)} × ${multiplier.toFixed(3)} = ${chroma.toFixed(3)} and hue ${h.toFixed(1)}`,
      )
    })

    it('renders the light scale generated from the accent anchor', () => {
      renderWithProviders(<AboutHowItWorks />)

      const { mean, stdDev } = TS_GAUSSIAN.light
      const expected = generateColorScale(
        ACCENT.anchor,
        TS_SCALE.light,
        mean,
        stdDev,
        'OKLCH',
      )
      const strip = screen.getByRole('list', {
        name: `${ACCENT.name}, light mode`,
      })
      expect(within(strip).getAllByRole('listitem')).toHaveLength(STEP_COUNT)
      expected.forEach((colour, i) => {
        expect(
          within(strip).getByTitle(`Step ${i + 1}: ${colour}`),
        ).toBeInTheDocument()
      })
    })
  })

  describe('Dark mode', () => {
    it('switches the example and step 9 to the dark values', () => {
      renderWithProviders(<AboutHowItWorks />, { scheme: 'dark' })

      const { l, mean, stdDev, multiplier } = step9('dark')
      expect(
        screen.getByRole('heading', {
          level: 3,
          name: `Example: ${ACCENT.name} in dark mode`,
        }),
      ).toBeInTheDocument()
      const text = workedExample()
      expect(text).toHaveTextContent(`Step 9 has L ${l}.`)
      expect(text).toHaveTextContent(
        `dark mode has mean ${mean} and standard deviation ${stdDev}`,
      )
      expect(text).toHaveTextContent(
        `a multiplier of ${multiplier.toFixed(3)} at that lightness`,
      )
    })

    it('renders the dark scale', () => {
      renderWithProviders(<AboutHowItWorks />, { scheme: 'dark' })

      const { mean, stdDev } = TS_GAUSSIAN.dark
      const expected = generateColorScale(
        ACCENT.anchor,
        TS_SCALE.dark,
        mean,
        stdDev,
        'OKLCH',
      )
      const strip = screen.getByRole('list', {
        name: `${ACCENT.name}, dark mode`,
      })
      expect(
        within(strip).getByTitle(`Step 9: ${expected[8]}`),
      ).toBeInTheDocument()
    })

    it('follows a change of scheme after the first render', () => {
      const { setColorScheme } = renderWithProviders(<AboutHowItWorks />)

      setColorScheme('dark')

      expect(workedExample()).toHaveTextContent(
        `Step 9 has L ${step9('dark').l}.`,
      )
    })
  })
})
