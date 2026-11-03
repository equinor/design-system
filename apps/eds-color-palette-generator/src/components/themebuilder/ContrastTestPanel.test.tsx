// @vitest-environment jsdom
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ContrastTestPanel } from './ContrastTestPanel'
import { renderWithProviders } from '@/test/renderWithProviders'
import { tokensStudioPalettes } from '@/utils/semanticTokens'

const PALETTES = tokensStudioPalettes('light')

describe('ContrastTestPanel', () => {
  describe('Rendering', () => {
    it('opens on the EDS checks', () => {
      renderWithProviders(<ContrastTestPanel palettes={PALETTES} />)

      const tabs = screen.getByRole('tablist', { name: 'Contrast checks' })
      expect(within(tabs).getByRole('tab', { name: 'EDS' })).toHaveAttribute(
        'aria-selected',
        'true',
      )
      const panel = screen.getByRole('tabpanel', { name: 'EDS' })
      expect(
        within(panel).getByRole('region', { name: 'Semantic pairings' }),
      ).toBeInTheDocument()
      expect(
        within(panel).getByRole('region', { name: 'Surface preview' }),
      ).toBeInTheDocument()
    })

    it('renders nothing without palettes', () => {
      const { container } = renderWithProviders(
        <ContrastTestPanel palettes={[]} />,
      )

      expect(container).toBeEmptyDOMElement()
    })
  })

  describe('Behaviour', () => {
    it('shows the custom checks on the Custom tab', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ContrastTestPanel palettes={PALETTES} />)

      await user.click(screen.getByRole('tab', { name: 'Custom' }))

      const panel = screen.getByRole('tabpanel', { name: 'Custom' })
      for (const name of [
        'Data colour chart',
        'Same-palette pairings',
        'Data colour picker',
      ]) {
        expect(within(panel).getByRole('region', { name })).toBeInTheDocument()
      }
      expect(
        screen.queryByRole('region', { name: 'Semantic pairings' }),
      ).not.toBeInTheDocument()
    })
  })
})
