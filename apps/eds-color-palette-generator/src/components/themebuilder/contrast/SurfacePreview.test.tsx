// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { SurfacePreview } from './SurfacePreview'
import { stepLabel } from '@/config/config'
import { calcContrast } from '@/utils/palette'
import { tokensStudioPalettes } from '@/utils/semanticTokens'

const PALETTES = tokensStudioPalettes('light').slice(0, 2)

/** The "Text / Card" contrast line of one palette. */
const textOnCard = (index: number) =>
  screen.getAllByText('Text / Card')[index].parentElement as HTMLElement

describe('SurfacePreview', () => {
  describe('Rendering', () => {
    it('renders the role selects and a preview per palette', () => {
      render(<SurfacePreview palettes={PALETTES} />)

      for (const name of [
        'Page',
        'Panel',
        'Card row',
        'Card',
        'Border',
        'Text',
      ]) {
        expect(screen.getByRole('combobox', { name })).toBeInTheDocument()
      }
      for (const p of PALETTES) {
        expect(
          screen.getByRole('heading', { name: p.name }),
        ).toBeInTheDocument()
      }
      expect(screen.getAllByText('Card 1')).toHaveLength(PALETTES.length)
    })

    it('shows the contrast of text.primary on the surface by default', () => {
      render(<SurfacePreview palettes={PALETTES} />)

      const [p] = PALETTES
      expect(textOnCard(0)).toHaveTextContent(
        calcContrast(p.steps[12], p.steps[14]).wcag,
      )
    })
  })

  describe('Behaviour', () => {
    it('updates the contrast when another text step is chosen', async () => {
      const user = userEvent.setup()
      render(<SurfacePreview palettes={PALETTES} />)

      await user.selectOptions(
        screen.getByRole('combobox', { name: 'Text' }),
        stepLabel(12),
      )

      const [p] = PALETTES
      expect(screen.getByRole('combobox', { name: 'Text' })).toHaveDisplayValue(
        stepLabel(12),
      )
      expect(textOnCard(0)).toHaveTextContent(
        calcContrast(p.steps[11], p.steps[14]).wcag,
      )
    })
  })
})
