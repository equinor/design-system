// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { usePathname } from 'next/navigation'
import { describe, expect, it, vi } from 'vitest'
import { ColorSchemeProvider } from '@/context/ColorSchemeContext'
import { DensityProvider } from '@/context/DensityContext'
import { AppHeader } from './AppHeader'
import { Button } from './Button'

vi.mock('next/navigation', () => ({ usePathname: vi.fn() }))

function renderHeader(props: Parameters<typeof AppHeader>[0] = {}) {
  return render(
    <ColorSchemeProvider>
      <DensityProvider>
        <AppHeader {...props} />
      </DensityProvider>
    </ColorSchemeProvider>,
  )
}

const NAV = [
  ['Theme Builder', '/'],
  ['Data visualisation', '/dataviz'],
  ['Palette editor', '/palette'],
  ['Contrast', '/contrast'],
  ['Examples', '/example'],
  ['About', '/about'],
]

const mainNav = () => screen.getByRole('navigation', { name: 'Main' })
const currentLinks = () =>
  within(mainNav())
    .getAllByRole('link')
    .filter((link) => link.getAttribute('aria-current') === 'page')
    .map((link) => link.textContent)

describe('AppHeader', () => {
  describe('Rendering', () => {
    it('is a banner with the product name linking home', () => {
      renderHeader()

      const banner = screen.getByRole('banner')
      expect(
        within(banner).getByRole('link', {
          name: 'EDS Colour Palette Generator',
        }),
      ).toHaveAttribute('href', '/')
    })

    it('lists the six routes in the main navigation', () => {
      renderHeader()

      const links = within(mainNav()).getAllByRole('link')
      expect(
        links.map((link) => [link.textContent, link.getAttribute('href')]),
      ).toEqual(NAV)
      expect(within(mainNav()).getAllByRole('listitem')).toHaveLength(6)
    })

    it('renders the page actions', () => {
      renderHeader({ actions: <Button>Config</Button> })

      expect(screen.getByRole('button', { name: 'Config' })).toBeVisible()
    })
  })

  describe('Current page', () => {
    it.each([
      ['/', 'Theme Builder'],
      ['/dataviz', 'Data visualisation'],
      ['/palette', 'Palette editor'],
      ['/contrast', 'Contrast'],
      ['/example', 'Examples'],
      ['/about', 'About'],
    ])('marks only the link for %s with aria-current', (pathname, label) => {
      vi.mocked(usePathname).mockReturnValue(pathname)
      renderHeader()

      expect(currentLinks()).toEqual([label])
      expect(
        within(mainNav()).getByRole('link', { name: label }),
      ).toHaveAttribute('aria-current', 'page')
    })

    it('marks a section link on a page below it', () => {
      vi.mocked(usePathname).mockReturnValue('/palette/moss-green')
      renderHeader()

      expect(currentLinks()).toEqual(['Palette editor'])
    })

    it('matches the home link only on / itself', () => {
      vi.mocked(usePathname).mockReturnValue('/about')
      renderHeader()

      expect(
        within(mainNav()).getByRole('link', { name: 'Theme Builder' }),
      ).not.toHaveAttribute('aria-current')
    })

    it('does not match a route that only shares a prefix', () => {
      vi.mocked(usePathname).mockReturnValue('/contrast-report')
      renderHeader()

      expect(currentLinks()).toEqual([])
    })

    it('marks no link when the pathname is unknown', () => {
      vi.mocked(usePathname).mockReturnValue(null as unknown as string)
      renderHeader()

      expect(currentLinks()).toEqual([])
    })
  })

  describe('Settings', () => {
    it('has a Settings button that announces a dialog', () => {
      renderHeader()

      expect(screen.getByRole('button', { name: 'Settings' })).toHaveAttribute(
        'aria-haspopup',
        'dialog',
      )
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    it('opens the settings dialog and closes it with Done', async () => {
      const user = userEvent.setup()
      renderHeader()

      await user.click(screen.getByRole('button', { name: 'Settings' }))
      expect(screen.getByRole('dialog', { name: 'Settings' })).toBeVisible()

      await user.click(screen.getByRole('button', { name: 'Done' }))
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    it('opens the settings dialog again after it was closed', async () => {
      const user = userEvent.setup()
      renderHeader()

      await user.click(screen.getByRole('button', { name: 'Settings' }))
      await user.click(screen.getByRole('button', { name: 'Close' }))
      await user.click(screen.getByRole('button', { name: 'Settings' }))

      expect(screen.getByRole('dialog', { name: 'Settings' })).toBeVisible()
    })
  })
})
