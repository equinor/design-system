import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { Button } from '.'

// Mock icon for testing - forwards props to SVG
const MockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg data-testid="mock-icon" aria-hidden {...props} />
)

describe('Button (next)', () => {
  describe('Rendering', () => {
    it('matches snapshot', () => {
      const { container } = render(<Button>Click me</Button>)
      expect(container).toMatchSnapshot()
    })

    it('renders with children', () => {
      render(<Button>Click me</Button>)
      expect(
        screen.getByRole('button', { name: /click me/i }),
      ).toBeInTheDocument()
    })

    it('renders with default props', () => {
      render(<Button>Default</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveAttribute('data-variant', 'primary')
      expect(button).toHaveAttribute('data-color-appearance', 'accent')
      expect(button).toHaveAttribute('data-selectable-space', 'md')
      expect(button).toHaveAttribute('type', 'button')
    })

    it('renders with custom variant', () => {
      render(<Button variant="secondary">Secondary</Button>)
      expect(screen.getByRole('button')).toHaveAttribute(
        'data-variant',
        'secondary',
      )
    })

    it('renders with ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>)
      expect(screen.getByRole('button')).toHaveAttribute(
        'data-variant',
        'ghost',
      )
    })

    it('renders with small size', () => {
      render(<Button size="small">Small</Button>)
      expect(screen.getByRole('button')).toHaveAttribute(
        'data-selectable-space',
        'sm',
      )
    })

    it('renders with large size', () => {
      render(<Button size="large">Large</Button>)
      expect(screen.getByRole('button')).toHaveAttribute(
        'data-selectable-space',
        'lg',
      )
    })

    it('renders with accent tone', () => {
      render(<Button tone="accent">Accent</Button>)
      expect(screen.getByRole('button')).toHaveAttribute(
        'data-color-appearance',
        'accent',
      )
    })

    it('renders with danger tone', () => {
      render(<Button tone="danger">Danger</Button>)
      expect(screen.getByRole('button')).toHaveAttribute(
        'data-color-appearance',
        'danger',
      )
    })

    it('applies custom className', () => {
      render(<Button className="custom-class">Custom</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('eds-button', 'custom-class')
    })

    it('forwards ref to button element', () => {
      const ref = { current: null as HTMLButtonElement | null }
      render(<Button ref={ref}>Ref</Button>)
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })

    it('spreads additional props to button element', () => {
      render(<Button data-testid="custom-button">Props</Button>)
      expect(screen.getByTestId('custom-button')).toBeInTheDocument()
    })
  })

  describe('Children (Icons and Text)', () => {
    it('renders icon as child', () => {
      render(
        <Button>
          <MockIcon />
          Label
        </Button>,
      )
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument()
    })

    it('renders icon after label', () => {
      render(
        <Button>
          Label
          <MockIcon />
        </Button>,
      )
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument()
      expect(screen.getByRole('button')).toHaveTextContent('Label')
    })

    it('renders multiple icons', () => {
      render(
        <Button>
          <MockIcon />
          Navigate
          <MockIcon />
        </Button>,
      )
      expect(screen.getAllByTestId('mock-icon')).toHaveLength(2)
    })

    it('wraps text children in typography', () => {
      render(<Button>Text Content</Button>)
      const button = screen.getByRole('button')
      // Text should be wrapped in a span (TypographyNext)
      // eslint-disable-next-line testing-library/no-node-access
      const span = button.querySelector('span')
      expect(span).toBeInTheDocument()
      expect(span).toHaveTextContent('Text Content')
    })

    it('preserves child order', () => {
      render(
        <Button>
          <MockIcon />
          Middle
          <MockIcon />
        </Button>,
      )
      const button = screen.getByRole('button')
      // Children are wrapped in TypographyNext span
      // eslint-disable-next-line testing-library/no-node-access
      const span = button.children[0]
      expect(span).toHaveTextContent('Middle')

      // Get all icons using data-testid
      const icons = screen.getAllByTestId('mock-icon')
      expect(icons).toHaveLength(2)
    })
  })

  describe('States', () => {
    it('is disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('does not trigger onClick when disabled', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>,
      )
      await user.click(screen.getByRole('button'))
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('sets tone to neutral when disabled regardless of tone prop', () => {
      render(
        <Button tone="danger" disabled>
          Disabled
        </Button>,
      )
      expect(screen.getByRole('button')).toHaveAttribute(
        'data-color-appearance',
        'neutral',
      )
    })

    it('sets tone to neutral when disabled with accent', () => {
      render(
        <Button tone="accent" disabled>
          Disabled
        </Button>,
      )
      expect(screen.getByRole('button')).toHaveAttribute(
        'data-color-appearance',
        'neutral',
      )
    })
  })

  describe('Edge Cases', () => {
    it('handles null children gracefully', () => {
      render(<Button>{null}</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('handles undefined children gracefully', () => {
      render(<Button>{undefined}</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('handles mixed children with null values', () => {
      render(
        <Button>
          {null}
          Label
          {undefined}
        </Button>,
      )
      expect(screen.getByRole('button')).toHaveTextContent('Label')
    })

    it('handles empty fragment children', () => {
      render(
        <Button>
          <></>
        </Button>,
      )
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Behavior', () => {
    it('handles click events', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Click</Button>)
      await user.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('supports keyboard navigation with Enter', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Keyboard</Button>)
      const button = screen.getByRole('button')
      button.focus()
      expect(button).toHaveFocus()
      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('supports keyboard activation with Space', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Space</Button>)
      const button = screen.getByRole('button')
      button.focus()
      await user.keyboard(' ')
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('defaults to type="button"', () => {
      render(<Button>Default Type</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
    })

    it('supports type="submit"', () => {
      render(<Button type="submit">Submit</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
    })

    it('supports type="reset"', () => {
      render(<Button type="reset">Reset</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('type', 'reset')
    })
  })

  describe('Variants', () => {
    it.each(['primary', 'secondary', 'ghost'] as const)(
      'renders %s variant',
      (variant) => {
        render(<Button variant={variant}>{variant}</Button>)
        expect(screen.getByRole('button')).toHaveAttribute(
          'data-variant',
          variant,
        )
      },
    )
  })

  describe('Sizes', () => {
    it.each([
      ['small', 'sm'],
      ['default', 'md'],
      ['large', 'lg'],
    ] as const)(
      'renders %s size with data-selectable-space=%s',
      (size, expected) => {
        render(<Button size={size}>{size}</Button>)
        expect(screen.getByRole('button')).toHaveAttribute(
          'data-selectable-space',
          expected,
        )
      },
    )
  })

  describe('Color Appearances', () => {
    it.each(['accent', 'neutral', 'danger'] as const)(
      'renders %s tone',
      (tone) => {
        render(<Button tone={tone}>{tone}</Button>)
        expect(screen.getByRole('button')).toHaveAttribute(
          'data-color-appearance',
          tone,
        )
      },
    )
  })

  describe('Accessibility', () => {
    it('has no accessibility violations (default)', async () => {
      const { container } = render(<Button>Accessible</Button>)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no accessibility violations (disabled)', async () => {
      const { container } = render(<Button disabled>Disabled</Button>)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no accessibility violations (with icon)', async () => {
      const { container } = render(
        <Button>
          <MockIcon />
          With Icon
        </Button>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no accessibility violations (all variants)', async () => {
      const { container } = render(
        <>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('is focusable', () => {
      render(<Button>Focusable</Button>)
      const button = screen.getByRole('button')
      button.focus()
      expect(button).toHaveFocus()
    })

    it('has no accessibility violations (icon-only with aria-label)', async () => {
      const { container } = render(
        <Button icon aria-label="Add item">
          <MockIcon />
        </Button>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('Icon-Only (icon prop)', () => {
    it('sets data-icon-only when icon prop is true', () => {
      render(
        <Button icon aria-label="Add">
          <MockIcon />
        </Button>,
      )
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-icon-only', 'true')
    })

    it('uses selectable space tokens for icon-only (default size)', () => {
      render(
        <Button icon aria-label="Add">
          <MockIcon />
        </Button>,
      )
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-selectable-space', 'md')
    })

    it('uses selectable space tokens for icon-only (small size)', () => {
      render(
        <Button icon aria-label="Add" size="small">
          <MockIcon />
        </Button>,
      )
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-selectable-space', 'sm')
    })

    it('uses selectable space tokens for icon-only (large size)', () => {
      render(
        <Button icon aria-label="Add" size="large">
          <MockIcon />
        </Button>,
      )
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-selectable-space', 'lg')
    })

    it('uses selectable space tokens for regular button', () => {
      render(
        <Button>
          <MockIcon />
          Label
        </Button>,
      )
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-selectable-space', 'md')
    })

    it('renders icon child in icon-only mode', () => {
      render(
        <Button icon aria-label="Add">
          <MockIcon />
        </Button>,
      )
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument()
    })

    it.each(['small', 'default', 'large'] as const)(
      'renders icon-only with %s size',
      (size) => {
        render(
          <Button icon aria-label="Add" size={size}>
            <MockIcon />
          </Button>,
        )
        expect(screen.getByRole('button')).toHaveAttribute('data-icon-only')
      },
    )

    it('does not set data-icon-only when icon prop is false', () => {
      render(<Button>Regular Button</Button>)
      const button = screen.getByRole('button')
      expect(button).not.toHaveAttribute('data-icon-only')
    })
  })

  describe('Round (icon-only buttons)', () => {
    it('does not set data-round on non-icon buttons', () => {
      render(<Button>Label Button</Button>)
      expect(screen.getByRole('button')).not.toHaveAttribute('data-round')
    })

    it('does not set data-round on buttons with label and icon', () => {
      render(
        <Button>
          <MockIcon />
          Label
        </Button>,
      )
      expect(screen.getByRole('button')).not.toHaveAttribute('data-round')
    })

    it('does not set data-round on icon-only button by default', () => {
      render(
        <Button icon aria-label="Add">
          <MockIcon />
        </Button>,
      )
      expect(screen.getByRole('button')).not.toHaveAttribute('data-round')
    })

    it('sets data-round on icon-only button when round is true', () => {
      render(
        <Button icon aria-label="Add" round>
          <MockIcon />
        </Button>,
      )
      expect(screen.getByRole('button')).toHaveAttribute('data-round', 'true')
    })

    it('ignores round prop on non-icon buttons', () => {
      render(<Button round>Label Button</Button>)
      expect(screen.getByRole('button')).not.toHaveAttribute('data-round')
    })

    it('has no accessibility violations (circular icon-only)', async () => {
      const { container } = render(
        <Button icon aria-label="Add" round>
          <MockIcon />
        </Button>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no accessibility violations (square icon-only)', async () => {
      const { container } = render(
        <Button icon aria-label="Add">
          <MockIcon />
        </Button>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
