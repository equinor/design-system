// @vitest-environment jsdom
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PALETTE_STEPS, categoryLabel, stepCategoryRuns } from '@/config/config'
import { STEP_COUNT } from '@/config/tokensStudio'
import { PATTERN_GROUP_SPECS, getLightness } from '@/utils/contrastPageData'
import { tokensStudioPalettes } from '@/utils/semanticTokens'
import { renderWithProviders } from '@/test/renderWithProviders'
import ContrastPage from './page'

vi.mock('next/navigation', () => ({ usePathname: () => '/contrast' }))

const LIGHT = tokensStudioPalettes('light')

const viewSwitch = () => screen.getByRole('radiogroup', { name: 'View' })
const palettePicker = () =>
  screen.queryByRole('radiogroup', { name: 'Palette' })

/** The colour of each step card, in the order the cards are shown. */
const shownColours = () =>
  screen
    .getAllByTitle(/^Copy /)
    .map((button) => button.getAttribute('title')?.replace('Copy ', ''))

/** The step number at the top of each step card, in order. */
const shownSteps = () =>
  screen
    .getAllByTitle(/^Copy /)
    .map((button) =>
      Number(button.parentElement?.firstElementChild?.textContent),
    )

async function chooseView(name: 'Curve' | 'Gradient' | 'Combined') {
  const user = userEvent.setup()
  await user.click(within(viewSwitch()).getByRole('radio', { name }))
}

describe('Contrast page', () => {
  describe('Rendering', () => {
    it('shows the page heading', () => {
      renderWithProviders(<ContrastPage />)

      expect(
        screen.getByRole('heading', { level: 1, name: 'Contrast' }),
      ).toBeInTheDocument()
    })

    it('offers the Curve, Gradient and Combined views, starting with Curve', () => {
      renderWithProviders(<ContrastPage />)

      const radios = within(viewSwitch()).getAllByRole('radio')
      expect(radios.map((radio) => radio.textContent)).toEqual([
        'Curve',
        'Gradient',
        'Combined',
      ])
      expect(radios[0]).toHaveAttribute('aria-checked', 'true')
    })

    it('offers the Tokens Studio palettes in the picker', () => {
      renderWithProviders(<ContrastPage />)

      const picker = palettePicker()
      if (!picker) throw new Error('No palette picker')
      expect(
        within(picker)
          .getAllByRole('radio')
          .map((radio) => radio.textContent),
      ).toEqual(LIGHT.map((palette) => palette.name))
    })
  })

  describe('Curve view', () => {
    it('shows the steps of the first palette in order', () => {
      renderWithProviders(<ContrastPage />)

      expect(shownSteps()).toEqual(PALETTE_STEPS.map((step) => step.step))
      expect(shownColours()).toEqual(LIGHT[0].steps)
    })

    it('groups the steps under their category and names each step', () => {
      renderWithProviders(<ContrastPage />)

      for (const run of stepCategoryRuns()) {
        expect(
          screen.getAllByText(categoryLabel(run.category)).length,
        ).toBeGreaterThan(0)
      }
      expect(
        screen.getAllByText(PALETTE_STEPS[8].label).length,
      ).toBeGreaterThan(0)
    })

    it('shows the chosen palette', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ContrastPage />)
      const target = LIGHT[3]

      await user.click(screen.getByRole('radio', { name: target.name }))

      expect(screen.getByRole('radio', { name: target.name })).toHaveAttribute(
        'aria-checked',
        'true',
      )
      expect(shownColours()).toEqual(target.steps)
    })
  })

  describe('Gradient view', () => {
    it('orders the steps from light to dark', async () => {
      renderWithProviders(<ContrastPage />)

      await chooseView('Gradient')

      const expected = LIGHT[0].steps
        .map((hex, i) => ({ hex, step: i + 1 }))
        .sort((a, b) => getLightness(b.hex) - getLightness(a.hex))
      expect(shownSteps()).toEqual(expected.map((s) => s.step))
      expect(shownColours()).toEqual(expected.map((s) => s.hex))
      expect(screen.queryByText('Background')).not.toBeInTheDocument()
    })
  })

  describe('Combined view', () => {
    it('shows the token pairs across tones and hides the palette picker', async () => {
      renderWithProviders(<ContrastPage />)

      await chooseView('Combined')

      expect(palettePicker()).not.toBeInTheDocument()
      for (const group of PATTERN_GROUP_SPECS) {
        expect(
          screen.getByRole('heading', { level: 2, name: group.title }),
        ).toBeInTheDocument()
      }
      expect(screen.queryAllByTitle(/^Copy /)).toHaveLength(0)
    })

    it('brings the palette picker back on leaving the combined view', async () => {
      renderWithProviders(<ContrastPage />)

      await chooseView('Combined')
      await chooseView('Curve')

      expect(palettePicker()).toBeInTheDocument()
      expect(shownSteps()).toHaveLength(STEP_COUNT)
    })
  })

  describe('Colour scheme', () => {
    it('uses the dark Tokens Studio palettes in dark mode', () => {
      renderWithProviders(<ContrastPage />, { scheme: 'dark' })

      expect(shownColours()).toEqual(tokensStudioPalettes('dark')[0].steps)
    })
  })
})
