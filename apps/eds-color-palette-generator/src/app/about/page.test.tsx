// @vitest-environment jsdom
import { screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/renderWithProviders'
import AboutPage from './page'

vi.mock('next/navigation', () => ({ usePathname: () => '/about' }))

function contentsLinks() {
  const contents = screen.getByRole('navigation', { name: 'Contents' })
  return within(contents).getAllByRole('link')
}

describe('About page', () => {
  describe('Rendering', () => {
    it('shows the page heading', () => {
      renderWithProviders(<AboutPage />)

      expect(
        screen.getByRole('heading', {
          level: 1,
          name: 'About the EDS Colour Palette Generator',
        }),
      ).toBeInTheDocument()
    })

    it('marks About as the current page in the navigation', () => {
      renderWithProviders(<AboutPage />)

      const nav = screen.getByRole('navigation', { name: 'Main' })
      expect(within(nav).getByRole('link', { name: 'About' })).toHaveAttribute(
        'aria-current',
        'page',
      )
    })
  })

  describe('Table of contents', () => {
    it('links every entry to a section with the same heading', () => {
      renderWithProviders(<AboutPage />)

      const links = contentsLinks()
      expect(links.length).toBeGreaterThan(0)
      for (const link of links) {
        const href = link.getAttribute('href') ?? ''
        expect(href.startsWith('#')).toBe(true)
        const section = document.getElementById(href.slice(1))
        expect(section, `no element with id ${href}`).not.toBeNull()
        expect(section?.tagName).toBe('SECTION')
        expect(
          within(section as HTMLElement).getByRole('heading', {
            level: 2,
            name: link.textContent ?? '',
          }),
        ).toBeInTheDocument()
      }
    })

    it('lists every section, in the order the page renders them', () => {
      const { container } = renderWithProviders(<AboutPage />)

      const sectionIds = Array.from(
        container.querySelectorAll('main section[id]'),
      ).map((section) => `#${section.id}`)
      const hrefs = contentsLinks().map((link) => link.getAttribute('href'))
      expect(hrefs).toEqual(sectionIds)
    })
  })

  describe('Accessibility', () => {
    it('has one level 1 heading', () => {
      renderWithProviders(<AboutPage />)

      expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    })

    it('uses each id only once', () => {
      const { container } = renderWithProviders(<AboutPage />)

      const ids = Array.from(container.querySelectorAll('[id]')).map(
        (element) => element.id,
      )
      expect(new Set(ids).size).toBe(ids.length)
    })
  })
})
