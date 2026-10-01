// @vitest-environment jsdom
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PALETTE_STEPS } from '@/config/config'
import { STEP_COUNT, TS_HUES } from '@/config/tokensStudio'
import {
  editablePalettesFromTokensStudio,
  getSimulationPalettes,
} from '@/utils/palette'
import { renderWithProviders } from '@/test/renderWithProviders'
import PalettePage from './page'

vi.mock('next/navigation', () => ({ usePathname: () => '/palette' }))

const TOKENS_STUDIO = editablePalettesFromTokensStudio()

// The page has over a hundred inputs, and a page-wide label or role query
// takes about a second here, so the name fields are found by their
// aria-label directly. Step fields use label queries inside one card.
const nameInputs = () =>
  Array.from(
    document.querySelectorAll<HTMLInputElement>(
      'input[aria-label="Palette name"]',
    ),
  )
const paletteNames = () => nameInputs().map((input) => input.value)

/** The card of the palette at `index`. */
function card(index: number) {
  const section = nameInputs()[index].closest('section')
  if (!section) throw new Error(`No card at ${index}`)
  return section
}

/** Clear a field and paste the text, so the page renders twice, not per key. */
async function replaceText(
  user: ReturnType<typeof userEvent.setup>,
  input: HTMLElement,
  text: string,
) {
  await user.clear(input)
  await user.paste(text)
}

const stepInput = (index: number, step: number) =>
  within(card(index)).getByLabelText(`${step} ${PALETTE_STEPS[step - 1].label}`)

describe('Palette editor page', () => {
  describe('Rendering', () => {
    it('shows the page heading', () => {
      renderWithProviders(<PalettePage />)

      expect(
        screen.getByRole('heading', { level: 1, name: 'Palette editor' }),
      ).toBeInTheDocument()
    })

    it('starts from the seven Tokens Studio hues', () => {
      renderWithProviders(<PalettePage />)

      expect(paletteNames()).toEqual(TS_HUES.map((hue) => hue.name))
      expect(paletteNames()).toEqual(TOKENS_STUDIO.map((p) => p.name))
    })

    it('fills each step with the Tokens Studio value', () => {
      renderWithProviders(<PalettePage />)

      TOKENS_STUDIO.forEach((palette, index) => {
        const values = PALETTE_STEPS.map(
          ({ step }) => (stepInput(index, step) as HTMLInputElement).value,
        )
        expect(values).toEqual(palette.steps)
      })
    })

    it('starts in the curve view', () => {
      renderWithProviders(<PalettePage />)

      expect(screen.getByRole('radio', { name: 'Curve' })).toHaveAttribute(
        'aria-checked',
        'true',
      )
    })
  })

  describe('Behaviour', () => {
    it('adds a Custom HEX palette at the end', async () => {
      const user = userEvent.setup()
      renderWithProviders(<PalettePage />)

      await user.click(screen.getByRole('button', { name: 'Custom HEX' }))

      expect(nameInputs()).toHaveLength(TOKENS_STUDIO.length + 1)
      const last = TOKENS_STUDIO.length
      expect(nameInputs()[last]).toHaveValue('Custom')
      for (let step = 1; step <= STEP_COUNT; step++) {
        expect(stepInput(last, step)).toHaveValue('#888888')
      }
    })

    it('renames a palette', async () => {
      const user = userEvent.setup()
      renderWithProviders(<PalettePage />)

      await replaceText(user, nameInputs()[1], 'Stone')

      expect(nameInputs()[1]).toHaveValue('Stone')
      expect(
        screen.getByRole('button', { name: 'Remove Stone' }),
      ).toBeInTheDocument()
    })

    it('removes a palette', async () => {
      const user = userEvent.setup()
      renderWithProviders(<PalettePage />)
      const removed = TOKENS_STUDIO[0].name

      await user.click(
        screen.getByRole('button', { name: `Remove ${removed}` }),
      )

      expect(paletteNames()).toEqual(TOKENS_STUDIO.slice(1).map((p) => p.name))
    })

    it('edits a step', async () => {
      const user = userEvent.setup()
      renderWithProviders(<PalettePage />)

      await replaceText(user, stepInput(0, 9), '#12345')
      expect(stepInput(0, 9)).toHaveAttribute('aria-invalid', 'true')

      await user.type(stepInput(0, 9), '6')
      expect(stepInput(0, 9)).toHaveValue('#123456')
      expect(stepInput(0, 9)).toHaveAttribute('aria-invalid', 'false')
      // The other palettes keep their value
      expect(stepInput(1, 9)).toHaveValue(TOKENS_STUDIO[1].steps[8])
    })

    it('restores the Tokens Studio hues after an edit', async () => {
      const user = userEvent.setup()
      renderWithProviders(<PalettePage />)

      await replaceText(user, nameInputs()[0], 'Edited')
      await replaceText(user, stepInput(0, 9), '#123456')
      await user.click(screen.getByRole('button', { name: 'Custom HEX' }))
      await user.click(
        screen.getByRole('button', { name: 'Reset to Tokens Studio' }),
      )

      expect(paletteNames()).toEqual(TOKENS_STUDIO.map((p) => p.name))
      expect(stepInput(0, 9)).toHaveValue(TOKENS_STUDIO[0].steps[8])
    })

    it('switches to the gradient view', async () => {
      const user = userEvent.setup()
      renderWithProviders(<PalettePage />)

      await user.click(screen.getByRole('radio', { name: 'Gradient' }))

      expect(screen.getByRole('radio', { name: 'Gradient' })).toHaveAttribute(
        'aria-checked',
        'true',
      )
      // The category headers belong to the curve view only
      expect(screen.queryByText('Background')).not.toBeInTheDocument()
    })
  })

  describe('Saving', () => {
    it('saves the Tokens Studio palettes on first load', () => {
      renderWithProviders(<PalettePage />)

      expect(getSimulationPalettes()).toEqual(TOKENS_STUDIO)
    })

    it('saves every edit for the Examples page', async () => {
      const user = userEvent.setup()
      renderWithProviders(<PalettePage />)

      await replaceText(user, stepInput(0, 9), '#123456')
      await user.click(screen.getByRole('button', { name: 'Custom HEX' }))

      const saved = getSimulationPalettes()
      expect(saved).toHaveLength(TOKENS_STUDIO.length + 1)
      expect(saved[0].steps[8]).toBe('#123456')
      expect(saved[saved.length - 1]).toEqual({
        name: 'Custom',
        steps: Array(STEP_COUNT).fill('#888888'),
      })
    })
  })

  describe('Accessibility', () => {
    it('names the view switch and each remove button', () => {
      renderWithProviders(<PalettePage />)

      expect(
        screen.getByRole('radiogroup', { name: 'View' }),
      ).toBeInTheDocument()
      for (const palette of TOKENS_STUDIO) {
        expect(
          screen.getByRole('button', { name: `Remove ${palette.name}` }),
        ).toBeInTheDocument()
      }
    })
  })
})
