import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { save } from '@equinor/eds-icons'
import { Badge } from '.'

describe('Badge (next)', () => {
  describe('Rendering', () => {
    it('renders children text', () => {
      render(<Badge>Status</Badge>)
      expect(screen.getByText('Status')).toBeInTheDocument()
    })

    it('renders as a span element', () => {
      const { container } = render(<Badge>Label</Badge>)
      expect(container.firstChild?.nodeName).toBe('SPAN')
    })

    it('applies custom className', () => {
      const { container } = render(<Badge className="custom">Label</Badge>)
      expect(container.firstChild).toHaveClass('eds-badge', 'custom')
    })

    it('forwards ref', () => {
      const ref = { current: null } as React.RefObject<HTMLSpanElement | null>
      render(<Badge ref={ref}>Label</Badge>)
      expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    })

    it('passes through extra HTML attributes', () => {
      render(<Badge data-testid="my-badge">Label</Badge>)
      expect(screen.getByTestId('my-badge')).toBeInTheDocument()
    })
  })

  describe('Sizes', () => {
    it('defaults to md size', () => {
      const { container } = render(<Badge>Label</Badge>)
      expect(container.firstChild).toHaveAttribute('data-size', 'md')
    })

    it('supports sm size', () => {
      const { container } = render(<Badge size="sm">Label</Badge>)
      expect(container.firstChild).toHaveAttribute('data-size', 'sm')
    })

    it('supports xs size', () => {
      const { container } = render(<Badge size="xs">Label</Badge>)
      expect(container.firstChild).toHaveAttribute('data-size', 'xs')
    })
  })

  describe('Emphasis', () => {
    it('defaults to primary emphasis', () => {
      const { container } = render(<Badge>Label</Badge>)
      expect(container.firstChild).toHaveAttribute(
        'data-emphasis',
        'primary',
      )
    })

    it('supports secondary emphasis', () => {
      const { container } = render(
        <Badge emphasis="secondary">Label</Badge>,
      )
      expect(container.firstChild).toHaveAttribute(
        'data-emphasis',
        'secondary',
      )
    })
  })

  describe('Colors', () => {
    it('defaults to neutral color appearance', () => {
      const { container } = render(<Badge>Label</Badge>)
      expect(container.firstChild).toHaveAttribute(
        'data-color-appearance',
        'neutral',
      )
    })

    it('sets semantic color appearance', () => {
      const { container } = render(<Badge color="accent">Label</Badge>)
      expect(container.firstChild).toHaveAttribute(
        'data-color-appearance',
        'accent',
      )
    })

    it.each(['danger', 'warning', 'info', 'success'] as const)(
      'sets %s color appearance',
      (color) => {
        const { container } = render(<Badge color={color}>Label</Badge>)
        expect(container.firstChild).toHaveAttribute(
          'data-color-appearance',
          color,
        )
      },
    )

    it('sets dataviz attributes for non-semantic colors', () => {
      const { container } = render(
        <Badge color="purple-berry">Label</Badge>,
      )
      expect(container.firstChild).toHaveAttribute(
        'data-badge-color',
        'purple-berry',
      )
      expect(container.firstChild).toHaveAttribute('data-colored', '')
    })

    it('does not set dataviz attributes for semantic colors', () => {
      const { container } = render(<Badge color="accent">Label</Badge>)
      expect(container.firstChild).not.toHaveAttribute('data-badge-color')
      expect(container.firstChild).not.toHaveAttribute('data-colored')
    })

    it('falls back to neutral appearance for dataviz colors', () => {
      const { container } = render(
        <Badge color="moss-green">Label</Badge>,
      )
      expect(container.firstChild).toHaveAttribute(
        'data-color-appearance',
        'neutral',
      )
    })
  })

  describe('Icon', () => {
    it('renders icon when provided', () => {
      const { container } = render(<Badge icon={save}>Label</Badge>)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('does not render icon when not provided', () => {
      const { container } = render(<Badge>Label</Badge>)
      const svg = container.querySelector('svg')
      expect(svg).not.toBeInTheDocument()
    })

    it('icon has aria-hidden', () => {
      const { container } = render(<Badge icon={save}>Label</Badge>)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('Accessibility', () => {
    it('passes axe accessibility test', async () => {
      const { container } = render(<Badge>Status</Badge>)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('passes axe with icon', async () => {
      const { container } = render(<Badge icon={save}>Status</Badge>)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('passes axe with color', async () => {
      const { container } = render(<Badge color="danger">Error</Badge>)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('passes axe with secondary emphasis', async () => {
      const { container } = render(
        <Badge emphasis="secondary" color="accent">
          Active
        </Badge>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
