// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AboutOverview } from './AboutOverview'
import { ADR_0016_URL } from './links'

describe('AboutOverview', () => {
  describe('Rendering', () => {
    it('renders the section the table of contents links to', () => {
      render(<AboutOverview />)

      const heading = screen.getByRole('heading', {
        level: 2,
        name: 'Overview',
      })
      expect(heading.closest('section')).toHaveAttribute('id', 'overview')
    })

    it('links to ADR 0016', () => {
      render(<AboutOverview />)

      expect(screen.getByRole('link', { name: 'ADR 0016' })).toHaveAttribute(
        'href',
        ADR_0016_URL,
      )
    })
  })

  describe('The pages', () => {
    it.each([
      ['Theme Builder', '/'],
      ['Data visualisation', '/dataviz'],
      ['Palette editor', '/palette'],
      ['Contrast', '/contrast'],
      ['Examples', '/example'],
    ])('links to the %s page', (name, href) => {
      render(<AboutOverview />)

      expect(screen.getByRole('link', { name })).toHaveAttribute('href', href)
    })

    it('describes each page next to its link', () => {
      render(<AboutOverview />)

      const terms = screen.getAllByRole('term')
      expect(terms).toHaveLength(5)
      for (const term of terms) {
        expect(term.nextElementSibling?.tagName).toBe('DD')
        expect(term.nextElementSibling?.textContent).not.toBe('')
      }
    })
  })
})
