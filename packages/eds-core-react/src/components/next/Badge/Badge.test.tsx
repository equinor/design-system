import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe } from 'jest-axe'
import { Badge } from '.'

describe('Badge (next)', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Badge>Label</Badge>)
      expect(screen.getByText('Label')).toBeInTheDocument()
    })

    it('renders children', () => {
      render(<Badge>Status</Badge>)
      expect(screen.getByText('Status')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(<Badge className="custom">Label</Badge>)
      expect(screen.getByText('Label')).toHaveClass('eds-badge', 'custom')
    })

    it('forwards ref', () => {
      const ref = { current: null as HTMLSpanElement | null }
      render(<Badge ref={ref}>Label</Badge>)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })

    it('spreads additional props', () => {
      render(<Badge data-custom="value">Label</Badge>)
      expect(screen.getByText('Label')).toHaveAttribute('data-custom', 'value')
    })
  })

  describe('Variants', () => {
    it('sets default data attributes', () => {
      render(<Badge>Label</Badge>)
      const badge = screen.getByText('Label')
      expect(badge).toHaveAttribute('data-color-appearance', 'neutral')
      expect(badge).toHaveAttribute('data-emphasis', 'low')
      expect(badge).toHaveAttribute('data-variant', 'solid')
    })

    it('sets tone data attribute', () => {
      render(<Badge tone="accent">Label</Badge>)
      expect(screen.getByText('Label')).toHaveAttribute(
        'data-color-appearance',
        'accent',
      )
    })

    it('sets emphasis data attribute', () => {
      render(<Badge emphasis="medium">Label</Badge>)
      expect(screen.getByText('Label')).toHaveAttribute(
        'data-emphasis',
        'medium',
      )
    })

    it('sets variant data attribute', () => {
      render(<Badge variant="outlined">Label</Badge>)
      expect(screen.getByText('Label')).toHaveAttribute(
        'data-variant',
        'outlined',
      )
    })
  })

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Badge>Label</Badge>)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no accessibility violations with all tone variants', async () => {
      const { container } = render(
        <div>
          <Badge tone="neutral">Neutral</Badge>
          <Badge tone="accent">Accent</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="info">Info</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="danger">Danger</Badge>
        </div>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
