// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { InteractivePicker } from './InteractivePicker'
import { stepLabel } from '@/config/config'
import { calcContrast } from '@/utils/palette'
import { tokensStudioPalettes } from '@/utils/semanticTokens'

const PALETTES = tokensStudioPalettes('light')

describe('InteractivePicker', () => {
  describe('Rendering', () => {
    it('starts on text.primary over the canvas with a card per palette', () => {
      render(<InteractivePicker palettes={PALETTES} />)

      expect(
        screen.getByRole('combobox', { name: 'Foreground' }),
      ).toHaveDisplayValue(stepLabel(13))
      expect(
        screen.getByRole('combobox', { name: 'Background' }),
      ).toHaveDisplayValue(stepLabel(1))
      for (const p of PALETTES) {
        expect(screen.getByText(p.name)).toBeInTheDocument()
      }
    })
  })

  describe('Behaviour', () => {
    it('recalculates every card for the chosen background', async () => {
      const user = userEvent.setup()
      render(<InteractivePicker palettes={PALETTES} />)

      await user.selectOptions(
        screen.getByRole('combobox', { name: 'Background' }),
        stepLabel(9),
      )

      const [p] = PALETTES
      const { apca } = calcContrast(p.steps[12], p.steps[8])
      expect(screen.getAllByText(`Lc ${apca}`).length).toBeGreaterThan(0)
      // Each card names its background step (the selects list it as well)
      expect(
        screen.getAllByText(stepLabel(9), { selector: 'span' }),
      ).toHaveLength(PALETTES.length)
    })
  })
})
