// @vitest-environment jsdom
import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SemanticPairings } from './SemanticPairings'
import { renderWithProviders } from '@/test/renderWithProviders'
import { TS_TONE_HUE, hueDisplayName } from '@/config/tokensStudio'
import { tokensStudioPalettes } from '@/utils/semanticTokens'

const PALETTES = tokensStudioPalettes('light')
const NEUTRAL = hueDisplayName(TS_TONE_HUE.light.neutral)

describe('SemanticPairings', () => {
  describe('Rendering', () => {
    it('renders the three pairing groups and names the neutral palette', () => {
      renderWithProviders(<SemanticPairings palettes={PALETTES} />)

      const card = screen.getByRole('region', { name: 'Semantic pairings' })
      for (const name of [
        'Text on muted fills',
        'text.on-emphasis on emphasis fills',
        'Borders on canvas and surface',
      ]) {
        expect(within(card).getByRole('heading', { name })).toBeInTheDocument()
      }
      expect(
        within(card).getByText(NEUTRAL, { selector: 'strong' }),
      ).toBeInTheDocument()
    })

    it('lets every palette but the neutral one play the tone', () => {
      renderWithProviders(<SemanticPairings palettes={PALETTES} />)

      // One pairing row per pair; each row has a card per tone palette
      const label =
        'text.on-emphasis.<tone> on background.interactive.<tone>.emphasis.default'
      const row = screen.getAllByText(label)[0].parentElement as HTMLElement
      for (const p of PALETTES) {
        if (p.name === NEUTRAL) {
          expect(within(row).queryByText(p.name)).not.toBeInTheDocument()
        } else {
          expect(within(row).getByText(p.name)).toBeInTheDocument()
        }
      }
    })

    it('renders nothing when only the neutral palette is given', () => {
      const neutral = PALETTES.filter((p) => p.name === NEUTRAL)
      const { container } = renderWithProviders(
        <SemanticPairings palettes={neutral} />,
      )

      expect(container).toBeEmptyDOMElement()
    })
  })
})
