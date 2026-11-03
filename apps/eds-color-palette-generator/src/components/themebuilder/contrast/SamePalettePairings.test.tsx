// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { SamePalettePairings } from './SamePalettePairings'
import { stepLabel } from '@/config/config'
import { tokensStudioPalettes } from '@/utils/semanticTokens'

const PALETTES = tokensStudioPalettes('light').slice(0, 3)
const DEFAULT_PAIRINGS = 4

describe('SamePalettePairings', () => {
  describe('Rendering', () => {
    it('renders the default pairings with a card per palette', () => {
      render(<SamePalettePairings palettes={PALETTES} />)

      expect(screen.getAllByRole('combobox', { name: 'fg' })).toHaveLength(
        DEFAULT_PAIRINGS,
      )
      expect(screen.getAllByRole('combobox', { name: 'bg' })).toHaveLength(
        DEFAULT_PAIRINGS,
      )
      expect(screen.getAllByText(PALETTES[0].name)).toHaveLength(
        DEFAULT_PAIRINGS,
      )
    })
  })

  describe('Behaviour', () => {
    it('adds a pairing', async () => {
      const user = userEvent.setup()
      render(<SamePalettePairings palettes={PALETTES} />)

      await user.click(screen.getByRole('button', { name: 'Add pairing' }))

      expect(screen.getAllByRole('combobox', { name: 'fg' })).toHaveLength(
        DEFAULT_PAIRINGS + 1,
      )
    })

    it('removes pairings down to the last one', async () => {
      const user = userEvent.setup()
      render(<SamePalettePairings palettes={PALETTES} />)

      for (let i = 0; i < DEFAULT_PAIRINGS - 1; i++) {
        await user.click(screen.getAllByRole('button', { name: 'Remove' })[0])
      }

      expect(screen.getAllByRole('combobox', { name: 'fg' })).toHaveLength(1)
      expect(
        screen.queryByRole('button', { name: 'Remove' }),
      ).not.toBeInTheDocument()
    })

    it('changes the foreground of one pairing', async () => {
      const user = userEvent.setup()
      render(<SamePalettePairings palettes={PALETTES} />)
      const [firstFg] = screen.getAllByRole('combobox', { name: 'fg' })

      await user.selectOptions(firstFg, stepLabel(11))

      expect(firstFg).toHaveDisplayValue(stepLabel(11))
      // The pairing's cards name the new step (the selects list it as well)
      expect(
        screen.getAllByText(stepLabel(11), { selector: 'span' }),
      ).toHaveLength(PALETTES.length)
    })
  })
})
