// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { stepLabel, stepsWithRole } from '@/config/config'
import { calcContrast } from '@/utils/palette'
import { tokensStudioPalettes } from '@/utils/semanticTokens'
import { InteractivePicker } from './InteractivePicker'

const PALETTES = tokensStudioPalettes('light').slice(0, 3)

const region = () => screen.getByRole('region', { name: 'Interactive picker' })
const foreground = () =>
  within(region()).getByLabelText('Foreground', { selector: 'select' })
const background = () =>
  within(region()).getByLabelText('Background', { selector: 'select' })

/** The result column for a palette, found by its name. */
function column(name: string) {
  const element = within(region()).getByText(name).parentElement
  if (!element) throw new Error(`No column ${name}`)
  return element
}

describe('InteractivePicker', () => {
  describe('Rendering', () => {
    it('starts with text.primary on background.canvas', () => {
      render(<InteractivePicker allPalettes={PALETTES} />)

      expect(foreground()).toHaveValue('13')
      expect(background()).toHaveValue('1')
    })

    it('offers the text and border steps as foreground, background steps as background', () => {
      render(<InteractivePicker allPalettes={PALETTES} />)

      const values = (select: HTMLElement) =>
        within(select)
          .getAllByRole('option')
          .map((option) => Number(option.getAttribute('value')))
      const fgSteps = new Set(
        [...stepsWithRole('text'), ...stepsWithRole('border')].map(
          (s) => s.step,
        ),
      )
      expect(values(foreground())).toEqual([...fgSteps].sort((a, b) => a - b))
      expect(values(background())).toEqual(
        stepsWithRole('background').map((s) => s.step),
      )
    })

    it('shows the pair for every palette', () => {
      render(<InteractivePicker allPalettes={PALETTES} />)

      for (const palette of PALETTES) {
        const result = calcContrast(palette.steps[12], palette.steps[0])
        expect(column(palette.name)).toHaveTextContent(`${result.wcag}:1`)
      }
    })
  })

  describe('Behaviour', () => {
    it('updates every palette when the foreground changes', async () => {
      const user = userEvent.setup()
      render(<InteractivePicker allPalettes={PALETTES} />)

      await user.selectOptions(foreground(), '8')

      for (const palette of PALETTES) {
        const col = column(palette.name)
        expect(col).toHaveTextContent(`fg: ${stepLabel(8)}`)
        expect(col).toHaveTextContent(
          `${calcContrast(palette.steps[7], palette.steps[0]).wcag}:1`,
        )
      }
    })
  })
})
