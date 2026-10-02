// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from './Button'
import { Card } from './Card'

describe('Card', () => {
  describe('Rendering', () => {
    it('renders its children', () => {
      render(
        <Card>
          <p>Fifteen steps</p>
        </Card>,
      )

      expect(screen.getByText('Fifteen steps')).toBeInTheDocument()
    })

    it('renders the title as a level 2 heading with the description under it', () => {
      render(
        <Card title="Palettes" description="The seven Tokens Studio anchors">
          Content
        </Card>,
      )

      expect(
        screen.getByRole('heading', { level: 2, name: 'Palettes' }),
      ).toBeInTheDocument()
      expect(
        screen.getByText('The seven Tokens Studio anchors'),
      ).toBeInTheDocument()
    })

    it('renders the actions in the header', () => {
      render(
        <Card title="Palettes" actions={<Button>Add palette</Button>}>
          Content
        </Card>,
      )

      expect(
        within(screen.getByRole('region', { name: 'Palettes' })).getByRole(
          'button',
          { name: 'Add palette' },
        ),
      ).toBeInTheDocument()
    })

    it('renders no heading without a title', () => {
      render(<Card description="Only a description">Content</Card>)

      expect(screen.queryByRole('heading')).toBeNull()
      expect(screen.getByText('Only a description')).toBeInTheDocument()
    })

    it('pads the content by default and not when padded is false', () => {
      const { rerender } = render(<Card data-testid="card">Content</Card>)
      expect(screen.getByTestId('card')).toHaveClass('p-5')

      rerender(
        <Card data-testid="card" padded={false}>
          Content
        </Card>,
      )
      expect(screen.getByTestId('card')).not.toHaveClass('p-5')
    })

    it('adds its className and data-testid to the section', () => {
      render(
        <Card data-testid="card" className="col-span-2">
          Content
        </Card>,
      )

      expect(screen.getByTestId('card').tagName).toBe('SECTION')
      expect(screen.getByTestId('card')).toHaveClass('col-span-2')
    })
  })

  describe('Accessibility', () => {
    it('is a region labelled by its title', () => {
      render(<Card title="Contrast">Content</Card>)

      const region = screen.getByRole('region', { name: 'Contrast' })
      expect(region).toHaveAttribute(
        'aria-labelledby',
        screen.getByRole('heading', { name: 'Contrast' }).id,
      )
    })

    it('is not labelled and not a region without a title', () => {
      render(<Card data-testid="card">Content</Card>)

      expect(screen.getByTestId('card')).not.toHaveAttribute('aria-labelledby')
      expect(screen.queryByRole('region')).toBeNull()
    })

    it('gives each card its own heading id', () => {
      render(
        <>
          <Card title="Light">Content</Card>
          <Card title="Dark">Content</Card>
        </>,
      )

      expect(screen.getByRole('region', { name: 'Light' })).toBeInTheDocument()
      expect(screen.getByRole('region', { name: 'Dark' })).toBeInTheDocument()
    })
  })
})
