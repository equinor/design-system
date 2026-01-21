import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { Button } from '.'

// Mock icon for testing
const MockIcon = () => <svg data-testid="mock-icon" />

describe('Button (next)', () => {
  describe('Rendering', () => {
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
      expect(button).toHaveAttribute('data-space-proportions', 'squished')
      expect(button).toHaveAttribute('type', 'button')
    })

    it('renders with custom variant', () => {
      render(<Button variant="outline">Outline</Button>)
      expect(screen.getByRole('button')).toHaveAttribute(
        'data-variant',
        'outline',
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

    it('renders with accent colorAppearance', () => {
      render(<Button colorAppearance="accent">Accent</Button>)
      expect(screen.getByRole('button')).toHaveAttribute(
        'data-color-appearance',
        'accent',
      )
    })

    it('renders with danger colorAppearance', () => {
      render(<Button colorAppearance="danger">Danger</Button>)
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

  describe('Icons', () => {
    it('renders iconStart when provided', () => {
      render(<Button iconStart={<MockIcon />}>Search</Button>)
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument()
    })

    it('renders iconEnd when provided', () => {
      render(<Button iconEnd={<MockIcon />}>Next</Button>)
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument()
    })

    it('renders both icons when provided', () => {
      render(
        <Button iconStart={<MockIcon />} iconEnd={<MockIcon />}>
          Navigate
        </Button>,
      )
      expect(screen.getAllByTestId('mock-icon')).toHaveLength(2)
    })

    it('hides icons from screen readers', () => {
      render(<Button iconStart={<MockIcon />}>With Icon</Button>)
      const button = screen.getByRole('button')
      // eslint-disable-next-line testing-library/no-node-access
      const iconWrapper = button.querySelector('[aria-hidden="true"]')
      expect(iconWrapper).toBeInTheDocument()
      expect(iconWrapper).toContainElement(screen.getByTestId('mock-icon'))
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
    it.each(['primary', 'outline', 'ghost'] as const)(
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
      'renders %s colorAppearance',
      (colorAppearance) => {
        render(
          <Button colorAppearance={colorAppearance}>{colorAppearance}</Button>,
        )
        expect(screen.getByRole('button')).toHaveAttribute(
          'data-color-appearance',
          colorAppearance,
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
        <Button iconStart={<MockIcon />}>With Icon</Button>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no accessibility violations (all variants)', async () => {
      const { container } = render(
        <>
          <Button variant="primary">Primary</Button>
          <Button variant="outline">Outline</Button>
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
  })
})
