// @vitest-environment jsdom
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { EXAMPLE_GROUPS } from '@/components/example/exampleGroups'
import type { Scheme } from '@/config/tokensStudio'
import { setSimulationPalettes, type TokenPalette } from '@/utils/palette'
import { tokensStudioPalettes } from '@/utils/semanticTokens'
import { renderWithProviders } from '@/test/renderWithProviders'
import ExamplePage from './page'

vi.mock('next/navigation', () => ({ usePathname: () => '/example' }))

const CUSTOM: TokenPalette = {
  name: 'My palette',
  steps: tokensStudioPalettes('light')[3].steps,
}

const picker = () => screen.getByRole('radiogroup', { name: 'Palette' })
const radioNames = () =>
  within(picker())
    .getAllByRole('radio')
    .map((radio) => radio.textContent)

/**
 * The first pairing of the first example group, text.on-muted (12) on the
 * muted fill (1), as foreground and background elements.
 */
function firstPairing() {
  const section = screen
    .getByRole('heading', { level: 2, name: EXAMPLE_GROUPS[0].title })
    .closest('section')
  if (!section) throw new Error('No example group')
  const sample = within(section).getAllByText('Aa')[0]
  const fill = sample.closest('[style*="background-color"]')
  return { sample, fill }
}

function expectPairingFrom(steps: string[]) {
  const { fg, bg } = EXAMPLE_GROUPS[0].pairings[0]
  const { sample, fill } = firstPairing()
  expect(sample).toHaveStyle({ color: steps[fg - 1] })
  expect(fill).toHaveStyle({ backgroundColor: steps[bg - 1] })
}

const namesFor = (scheme: Scheme) =>
  tokensStudioPalettes(scheme).map((palette) => palette.name)

describe('Examples page', () => {
  describe('Rendering', () => {
    it('shows the page heading', () => {
      renderWithProviders(<ExamplePage />)

      expect(
        screen.getByRole('heading', { level: 1, name: 'Examples' }),
      ).toBeInTheDocument()
    })

    it('offers the Tokens Studio palettes in the picker', () => {
      renderWithProviders(<ExamplePage />)

      expect(radioNames()).toEqual(namesFor('light'))
      expect(within(picker()).getAllByRole('radio')[0]).toHaveAttribute(
        'aria-checked',
        'true',
      )
    })

    it('previews the first palette', () => {
      renderWithProviders(<ExamplePage />)

      expectPairingFrom(tokensStudioPalettes('light')[0].steps)
    })

    it('shows the surface preview and the interactive picker for every palette', () => {
      renderWithProviders(<ExamplePage />)

      for (const name of ['Surface preview', 'Interactive picker']) {
        const region = screen.getByRole('region', { name })
        for (const palette of namesFor('light')) {
          expect(within(region).getByText(palette)).toBeInTheDocument()
        }
      }
    })
  })

  describe('Behaviour', () => {
    it('updates the previews when another palette is picked', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ExamplePage />)
      const target = tokensStudioPalettes('light')[4]

      await user.click(
        within(picker()).getByRole('radio', { name: target.name }),
      )

      expect(
        within(picker()).getByRole('radio', { name: target.name }),
      ).toHaveAttribute('aria-checked', 'true')
      expectPairingFrom(target.steps)
    })

    it('adds the palettes saved in the Palette editor after the Tokens Studio ones', () => {
      setSimulationPalettes([CUSTOM])
      renderWithProviders(<ExamplePage />)

      expect(radioNames()).toEqual([...namesFor('light'), CUSTOM.name])
    })

    it('picks up newly saved palettes on Refresh', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ExamplePage />)
      expect(radioNames()).not.toContain(CUSTOM.name)

      setSimulationPalettes([CUSTOM])
      await user.click(screen.getByRole('button', { name: 'Refresh' }))

      expect(radioNames()).toContain(CUSTOM.name)
      await user.click(
        within(picker()).getByRole('radio', { name: CUSTOM.name }),
      )
      expectPairingFrom(CUSTOM.steps)
    })
  })

  describe('Colour scheme', () => {
    it('uses the dark Tokens Studio palettes in dark mode', () => {
      renderWithProviders(<ExamplePage />, { scheme: 'dark' })

      expect(radioNames()).toEqual(namesFor('dark'))
      expectPairingFrom(tokensStudioPalettes('dark')[0].steps)
    })
  })
})
