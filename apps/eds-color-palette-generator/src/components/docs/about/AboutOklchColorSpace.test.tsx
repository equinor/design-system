// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TS_HUES } from '@/config/tokensStudio'
import { AboutOklchColorSpace } from './AboutOklchColorSpace'

/** Chroma from the anchor as Tokens Studio writes it: `oklch(L C H)` */
function chromaOf(anchor: string): number {
  const match = anchor.match(/^oklch\([\d.]+ ([\d.]+) [\d.]+\)$/)
  if (!match) throw new Error(`Unexpected anchor: ${anchor}`)
  return Number(match[1])
}

describe('AboutOklchColorSpace', () => {
  describe('Rendering', () => {
    it('renders the section the table of contents links to', () => {
      render(<AboutOklchColorSpace />)

      const heading = screen.getByRole('heading', {
        level: 2,
        name: 'Why OKLCH',
      })
      expect(heading.closest('section')).toHaveAttribute(
        'id',
        'oklch-color-space',
      )
    })

    it('explains lightness, chroma and hue', () => {
      render(<AboutOklchColorSpace />)

      expect(
        screen.getAllByRole('term').map((term) => term.textContent),
      ).toEqual(['Lightness (L)', 'Chroma (C)', 'Hue (H)'])
    })
  })

  describe('Tokens Studio values', () => {
    it('names the most colourful Tokens Studio anchor and its chroma', () => {
      render(<AboutOklchColorSpace />)

      const strongest = TS_HUES.reduce((max, hue) =>
        chromaOf(hue.anchor) > chromaOf(max.anchor) ? hue : max,
      )
      expect(
        screen.getByText(/^How colourful the colour is/),
      ).toHaveTextContent(
        `the most colourful anchor in Tokens Studio, ${strongest.name}, has chroma ${chromaOf(strongest.anchor).toFixed(2)}`,
      )
    })
  })
})
