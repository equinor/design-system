// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  PALETTE_STEPS,
  categoryLabel,
  stepCategoryRuns,
  stepLabel,
  stepRolesText,
} from '@/config/config'
import { STEP_COUNT } from '@/config/tokensStudio'
import { editablePalettesFromTokensStudio } from '@/utils/palette'
import type { TokenPalette } from '@/utils/palette'
import { PaletteCard, type PaletteViewMode } from './PaletteCard'

const PALETTE = editablePalettesFromTokensStudio()[0]

/** Greys from black to near white, so step 15 is the lightest. */
const GREYS: TokenPalette = {
  name: 'Greys',
  steps: Array.from({ length: STEP_COUNT }, (_, i) => {
    const channel = (i * 17).toString(16).padStart(2, '0')
    return `#${channel}${channel}${channel}`
  }),
}

function renderCard({
  palette = PALETTE,
  index = 2,
  viewMode = 'curve',
}: {
  palette?: TokenPalette
  index?: number
  viewMode?: PaletteViewMode
} = {}) {
  const handlers = {
    onNameChange: vi.fn(),
    onRemove: vi.fn(),
    onStepChange: vi.fn(),
  }
  render(
    <PaletteCard
      palette={palette}
      index={index}
      viewMode={viewMode}
      {...handlers}
    />,
  )
  return handlers
}

/** The step inputs in the order they are shown, by their visible step. */
const stepInputs = () =>
  screen
    .getAllByRole('textbox')
    .filter((input) => input.getAttribute('aria-label') !== 'Palette name')

const stepInput = (step: number) =>
  screen.getByRole('textbox', {
    name: `${step} ${PALETTE_STEPS[step - 1].label}`,
  })

describe('PaletteCard', () => {
  describe('Rendering', () => {
    it('shows the palette name in an editable field', () => {
      renderCard()

      expect(screen.getByRole('textbox', { name: 'Palette name' })).toHaveValue(
        PALETTE.name,
      )
    })

    it('renders a swatch for every step with its label, value and roles', () => {
      renderCard()

      // The tooltip puts the roles on a second line
      const titles = screen
        .getAllByTitle(/^\d+ · /)
        .map((swatch) => swatch.getAttribute('title'))
      expect(titles).toEqual(
        PALETTE.steps.map(
          (hex, i) => `${stepLabel(i + 1)}: ${hex}\n${stepRolesText(i + 1)}`,
        ),
      )
    })

    it('renders a labelled input with the value of every step', () => {
      renderCard()

      expect(stepInputs()).toHaveLength(STEP_COUNT)
      PALETTE.steps.forEach((hex, i) => {
        expect(stepInput(i + 1)).toHaveValue(hex)
      })
    })

    it('groups the steps under their category in the curve view', () => {
      renderCard()

      for (const run of stepCategoryRuns()) {
        expect(
          screen.getAllByText(categoryLabel(run.category)).length,
        ).toBeGreaterThan(0)
      }
    })

    it('keeps the steps in order in the curve view', () => {
      renderCard({ palette: GREYS })

      expect(stepInputs().map((input) => input.getAttribute('value'))).toEqual(
        GREYS.steps,
      )
    })

    it('sorts the steps from light to dark in the gradient view', () => {
      renderCard({ palette: GREYS, viewMode: 'gradient' })

      expect(stepInputs().map((input) => input.getAttribute('value'))).toEqual(
        [...GREYS.steps].reverse(),
      )
      for (const run of stepCategoryRuns()) {
        expect(
          screen.queryByText(categoryLabel(run.category)),
        ).not.toBeInTheDocument()
      }
    })
  })

  describe('Behaviour', () => {
    it('reports a new name with the palette index', async () => {
      const user = userEvent.setup()
      const { onNameChange } = renderCard({ index: 2 })

      await user.type(
        screen.getByRole('textbox', { name: 'Palette name' }),
        'X',
      )

      expect(onNameChange).toHaveBeenCalledWith(2, `${PALETTE.name}X`)
    })

    it('reports a step change with the palette and step index', async () => {
      const user = userEvent.setup()
      const { onStepChange } = renderCard({ index: 2 })

      await user.type(stepInput(9), '0')

      expect(onStepChange).toHaveBeenCalledWith(2, 8, `${PALETTE.steps[8]}0`)
    })

    it('reports the original step index in the gradient view', async () => {
      const user = userEvent.setup()
      const { onStepChange } = renderCard({
        palette: GREYS,
        index: 0,
        viewMode: 'gradient',
      })

      // The first input shown is step 15, the lightest grey
      await user.type(stepInputs()[0], 'f')

      expect(onStepChange).toHaveBeenCalledWith(0, 14, `${GREYS.steps[14]}f`)
    })

    it('asks to remove the palette with its index', async () => {
      const user = userEvent.setup()
      const { onRemove } = renderCard({ index: 2 })

      await user.click(
        screen.getByRole('button', { name: `Remove ${PALETTE.name}` }),
      )

      expect(onRemove).toHaveBeenCalledWith(2)
    })
  })

  describe('Accessibility', () => {
    it('marks a step that is not a six-digit hex value as invalid', () => {
      const steps = [...PALETTE.steps]
      steps[4] = '#12'
      renderCard({ palette: { ...PALETTE, steps } })

      expect(stepInput(5)).toHaveAttribute('aria-invalid', 'true')
      expect(stepInput(4)).toHaveAttribute('aria-invalid', 'false')
    })

    it('names the remove button after the palette', () => {
      renderCard({ palette: { ...PALETTE, name: '' } })

      expect(
        screen.getByRole('button', { name: 'Remove palette' }),
      ).toBeInTheDocument()
    })
  })
})
