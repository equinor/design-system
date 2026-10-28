// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  TONES,
  TS_GAUSSIAN,
  TS_SCALE,
  TS_TONE_HUE,
  hueDisplayName,
} from '@/config/tokensStudio'
import { gaussian } from '@/utils/color'
import { AboutLightAndDark } from './AboutLightAndDark'

const SWITCHING = TONES.filter(
  (tone) => TS_TONE_HUE.light[tone] !== TS_TONE_HUE.dark[tone],
)
const STAYING = TONES.filter((tone) => !SWITCHING.includes(tone))

/** The text that explains one of the three terms. */
function definitionOf(term: string) {
  const termElement = screen
    .getAllByRole('term')
    .find((element) => element.textContent === term)
  if (!termElement) throw new Error(`No term ${term}`)
  return termElement.nextElementSibling as HTMLElement
}

describe('AboutLightAndDark', () => {
  describe('Rendering', () => {
    it('renders the section the table of contents links to', () => {
      render(<AboutLightAndDark />)

      const heading = screen.getByRole('heading', {
        level: 2,
        name: 'Light and dark mode',
      })
      expect(heading.closest('section')).toHaveAttribute('id', 'light-and-dark')
    })

    it('explains lightness, the Gaussian curve and the hue per tone', () => {
      render(<AboutLightAndDark />)

      expect(
        screen.getAllByRole('term').map((term) => term.textContent),
      ).toEqual(['Lightness', 'Gaussian curve', 'Hue per tone'])
    })
  })

  describe('Tokens Studio values', () => {
    it('gives the mean of both curves and the step 9 multipliers', () => {
      render(<AboutLightAndDark />)

      const l = TS_SCALE.dark[8]
      const dark = gaussian(l, TS_GAUSSIAN.dark.mean, TS_GAUSSIAN.dark.stdDev)
      const light = gaussian(
        l,
        TS_GAUSSIAN.light.mean,
        TS_GAUSSIAN.light.stdDev,
      )
      const text = definitionOf('Gaussian curve')
      expect(text).toHaveTextContent(
        `The mean is ${TS_GAUSSIAN.light.mean} in light mode and ${TS_GAUSSIAN.dark.mean} in dark mode.`,
      )
      expect(text).toHaveTextContent(`Step 9 in dark mode has L ${l}`)
      expect(text).toHaveTextContent(
        `a multiplier of ${dark.toFixed(2)}, where the light curve would give ${light.toFixed(2)}`,
      )
    })

    it('names the tones whose hue switches between the modes', () => {
      render(<AboutLightAndDark />)

      expect(SWITCHING.length).toBeGreaterThan(0)
      const text = definitionOf('Hue per tone')
      for (const tone of SWITCHING) {
        expect(text).toHaveTextContent(
          `The ${tone} tone uses ${hueDisplayName(TS_TONE_HUE.light[tone])} in light mode and ${hueDisplayName(TS_TONE_HUE.dark[tone])} in dark mode.`,
        )
      }
    })

    it('does not name the tones that keep their hue', () => {
      render(<AboutLightAndDark />)

      const text = definitionOf('Hue per tone')
      for (const tone of STAYING) {
        expect(text).not.toHaveTextContent(`The ${tone} tone uses`)
      }
    })
  })
})
