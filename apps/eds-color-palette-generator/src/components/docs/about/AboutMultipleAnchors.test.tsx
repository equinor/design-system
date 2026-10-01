// @vitest-environment jsdom
import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  STEP_COUNT,
  TS_GAUSSIAN,
  TS_HUES,
  TS_SCALE,
  TS_TONE_HUE,
  type Scheme,
} from '@/config/tokensStudio'
import { generateColorScale } from '@/utils/color'
import { renderWithProviders } from '@/test/renderWithProviders'
import { AboutMultipleAnchors } from './AboutMultipleAnchors'

const hueOf = (tone: 'accent' | 'info') => {
  const hue = TS_HUES.find((h) => h.key === TS_TONE_HUE.light[tone])
  if (!hue) throw new Error(`No Tokens Studio hue for ${tone}`)
  return hue
}
const START = hueOf('accent')
const END = hueOf('info')
const MARKED = [4, 12]

function expectedScale(scheme: Scheme) {
  return generateColorScale(
    [
      { step: 4, value: START.anchor },
      { step: 12, value: END.anchor },
    ],
    TS_SCALE[scheme],
    TS_GAUSSIAN[scheme].mean,
    TS_GAUSSIAN[scheme].stdDev,
    'OKLCH',
  )
}

function strip(scheme: Scheme) {
  return screen.getByRole('list', {
    name: `${START.name} to ${END.name}, ${scheme} mode`,
  })
}

describe('AboutMultipleAnchors', () => {
  describe('Rendering', () => {
    it('renders the section the table of contents links to', () => {
      renderWithProviders(<AboutMultipleAnchors />)

      const heading = screen.getByRole('heading', {
        level: 2,
        name: 'Palettes with several anchors',
      })
      expect(heading.closest('section')).toHaveAttribute(
        'id',
        'multiple-anchors',
      )
    })

    it('uses the accent hue at step 4 and the info hue at step 12', () => {
      renderWithProviders(<AboutMultipleAnchors />)

      expect(
        screen.getByRole('heading', {
          level: 3,
          name: `Example: ${START.name} at step 4, ${END.name} at step 12`,
        }),
      ).toBeInTheDocument()
      expect(screen.getByText(START.anchor)).toBeInTheDocument()
      expect(screen.getByText(END.anchor)).toBeInTheDocument()
      expect(
        screen.getByText(`${START.name} anchor at step 4`),
      ).toBeInTheDocument()
      expect(
        screen.getByText(`${END.name} anchor at step 12`),
      ).toBeInTheDocument()
    })
  })

  describe('Scale', () => {
    it('renders the scale interpolated between the two anchors', () => {
      renderWithProviders(<AboutMultipleAnchors />)

      const list = strip('light')
      expect(within(list).getAllByRole('listitem')).toHaveLength(STEP_COUNT)
      expectedScale('light').forEach((colour, i) => {
        expect(
          within(list).getByTitle(`Step ${i + 1}: ${colour}`),
        ).toBeInTheDocument()
      })
    })

    it('marks steps 4 and 12, the steps that hold the anchors', () => {
      renderWithProviders(<AboutMultipleAnchors />)

      const scale = expectedScale('light')
      const list = strip('light')
      for (let step = 1; step <= STEP_COUNT; step++) {
        const swatch = within(list).getByTitle(
          `Step ${step}: ${scale[step - 1]}`,
        )
        expect(swatch.className.includes('outline-2')).toBe(
          MARKED.includes(step),
        )
      }
    })

    it('uses the dark values in dark mode', () => {
      renderWithProviders(<AboutMultipleAnchors />, { scheme: 'dark' })

      const list = strip('dark')
      expectedScale('dark').forEach((colour, i) => {
        expect(
          within(list).getByTitle(`Step ${i + 1}: ${colour}`),
        ).toBeInTheDocument()
      })
      expect(screen.getByText(/Generated live in dark mode/)).toBeVisible()
    })
  })
})
