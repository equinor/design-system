// @vitest-environment jsdom
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { TokenMatrix } from './TokenMatrix'
import { generatedPalettes } from '@/test/fixtures'
import { renderWithProviders } from '@/test/renderWithProviders'
import { categoryLabel, stepCategoryRuns, stepLabel } from '@/config/config'
import { STEP_COUNT } from '@/config/tokensStudio'
import { toOklchString } from '@/utils/color'
import { localStorageUtils } from '@/utils/localStorage'

const PALETTES = generatedPalettes('light')

/** The copy button of one palette step (1-based). */
const stepButton = (name: string, step: number) =>
  screen.getByRole('button', {
    name: new RegExp(`^Copy ${name} step ${stepLabel(step)}: `),
  })

describe('TokenMatrix', () => {
  describe('Rendering', () => {
    it('renders a copy button for every step of every palette', () => {
      renderWithProviders(<TokenMatrix palettes={PALETTES} />)

      const matrix = screen.getByRole('region', { name: 'Token matrix' })
      expect(within(matrix).getAllByRole('button')).toHaveLength(
        PALETTES.length * STEP_COUNT,
      )
      for (const palette of PALETTES) {
        expect(screen.getByText(palette.name)).toBeInTheDocument()
      }
    })

    it('labels the step groups with their categories', () => {
      renderWithProviders(<TokenMatrix palettes={PALETTES} />)

      for (const run of stepCategoryRuns()) {
        expect(
          screen.getAllByText(categoryLabel(run.category)).length,
        ).toBeGreaterThan(0)
      }
    })

    it('shows L, C and H in OKLCH format', () => {
      renderWithProviders(<TokenMatrix palettes={PALETTES} />)

      const palette = PALETTES[0]
      const button = stepButton(palette.name, 9)
      const value = palette.oklch[8]
      expect(button).toHaveAccessibleName(
        `Copy ${palette.name} step ${stepLabel(9)}: ${value}`,
      )
      const [l, c, h] = value.replace(/^oklch\(|\)$/g, '').split(' ')
      expect(within(button).getByText(l)).toBeInTheDocument()
      expect(within(button).getByText(c)).toBeInTheDocument()
      expect(within(button).getByText(h)).toBeInTheDocument()
    })

    it('derives OKLCH from hex when a palette has no OKLCH steps', () => {
      const { name, steps } = PALETTES[1]
      renderWithProviders(<TokenMatrix palettes={[{ name, steps }]} />)

      expect(stepButton(name, 3)).toHaveAccessibleName(
        `Copy ${name} step ${stepLabel(3)}: ${toOklchString(steps[2])}`,
      )
    })

    it('shows hex in HEX format', () => {
      localStorageUtils.setColorFormat('HEX')
      renderWithProviders(<TokenMatrix palettes={PALETTES} />)

      const palette = PALETTES[0]
      expect(stepButton(palette.name, 9)).toHaveTextContent(palette.steps[8])
    })

    it('renders nothing without palettes', () => {
      renderWithProviders(<TokenMatrix palettes={[]} />)

      expect(screen.queryByRole('region')).not.toBeInTheDocument()
    })
  })

  describe('Behaviour', () => {
    it('copies the shown value and confirms it', async () => {
      const user = userEvent.setup()
      renderWithProviders(<TokenMatrix palettes={PALETTES} />)
      const palette = PALETTES[2]
      const button = stepButton(palette.name, 13)

      await user.click(button)

      await expect(navigator.clipboard.readText()).resolves.toBe(
        palette.oklch[12],
      )
      expect(button).toHaveTextContent('Copied!')
    })
  })
})
