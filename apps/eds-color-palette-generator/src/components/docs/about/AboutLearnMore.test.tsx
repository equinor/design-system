// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AboutLearnMore } from './AboutLearnMore'
import { ADR_0016_URL } from './links'

describe('AboutLearnMore', () => {
  describe('Rendering', () => {
    it('renders the section the table of contents links to', () => {
      render(<AboutLearnMore />)

      const heading = screen.getByRole('heading', {
        level: 2,
        name: 'Learn more',
      })
      expect(heading.closest('section')).toHaveAttribute('id', 'learn-more')
    })

    it('groups the reading under EDS and Colour and contrast', () => {
      render(<AboutLearnMore />)

      expect(
        screen
          .getAllByRole('heading', { level: 3 })
          .map((heading) => heading.textContent),
      ).toEqual(['EDS', 'Colour and contrast'])
    })

    it('links to ADR 0016 with the shared link', () => {
      render(<AboutLearnMore />)

      expect(screen.getByRole('link', { name: /^ADR 0016/ })).toHaveAttribute(
        'href',
        ADR_0016_URL,
      )
    })
  })

  describe('Accessibility', () => {
    it('opens every link in a new tab without giving it the opener', () => {
      render(<AboutLearnMore />)

      for (const link of screen.getAllByRole('link')) {
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      }
    })
  })
})
