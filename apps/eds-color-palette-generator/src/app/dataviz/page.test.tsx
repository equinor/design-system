// @vitest-environment jsdom
import { screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/renderWithProviders'
import DataVizPage from './page'

vi.mock('next/navigation', () => ({ usePathname: () => '/dataviz' }))

describe('Data visualisation page', () => {
  describe('Rendering', () => {
    it('shows the page heading', () => {
      renderWithProviders(<DataVizPage />)

      expect(
        screen.getByRole('heading', { level: 1, name: 'Data visualisation' }),
      ).toBeInTheDocument()
    })

    it('marks Data visualisation as the current page in the navigation', () => {
      renderWithProviders(<DataVizPage />)

      const nav = screen.getByRole('navigation', { name: 'Main' })
      expect(
        within(nav).getByRole('link', { name: 'Data visualisation' }),
      ).toHaveAttribute('aria-current', 'page')
    })

    it('renders its content in the chosen colour scheme', () => {
      renderWithProviders(<DataVizPage />, { scheme: 'dark' })

      expect(screen.getByRole('main')).toHaveAttribute(
        'data-color-scheme',
        'dark',
      )
      expect(
        screen.getByRole('heading', { level: 1, name: 'Data visualisation' }),
      ).toBeInTheDocument()
    })
  })
})
