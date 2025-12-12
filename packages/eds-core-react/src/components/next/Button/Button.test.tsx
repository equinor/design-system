/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  test('renders with children', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })

  test('renders as button element with type button by default', () => {
    render(<Button>Submit</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'button')
  })

  test('supports type prop', () => {
    render(<Button type="submit">Submit</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'submit')
  })

  test('applies default variant class', () => {
    render(<Button>Default</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('button--primary')
  })

  test('applies variant class when specified', () => {
    render(<Button variant="outline">Outline</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('button--outline')
  })

  test('applies ghost variant class', () => {
    render(<Button variant="ghost">Ghost</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('button--ghost')
  })

  test('applies default size class', () => {
    render(<Button>Default Size</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('button--default')
  })

  test('applies small size class', () => {
    render(<Button size="small">Small</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('button--small')
  })

  test('applies large size class', () => {
    render(<Button size="large">Large</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('button--large')
  })

  test('applies data-color-appearance attribute', () => {
    render(<Button colorAppearance="danger">Delete</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-color-appearance', 'danger')
  })

  test('defaults to accent color appearance', () => {
    render(<Button>Default</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-color-appearance', 'accent')
  })

  test('applies neutral color appearance', () => {
    render(<Button colorAppearance="neutral">Neutral</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-color-appearance', 'neutral')
  })

  test('handles click events', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    const button = screen.getByRole('button')
    await user.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('does not trigger click when disabled', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>,
    )
    const button = screen.getByRole('button')
    await user.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  test('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  test('accepts custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
    expect(button).toHaveClass('button')
  })

  test('renders iconStart when provided', () => {
    render(
      <Button iconStart={<span data-testid="icon-start">🔍</span>}>
        Search
      </Button>,
    )
    expect(screen.getByTestId('icon-start')).toBeInTheDocument()
  })

  test('renders iconEnd when provided', () => {
    render(
      <Button iconEnd={<span data-testid="icon-end">→</span>}>Next</Button>,
    )
    expect(screen.getByTestId('icon-end')).toBeInTheDocument()
  })

  test('renders both icons when provided', () => {
    render(
      <Button
        iconStart={<span data-testid="icon-start">←</span>}
        iconEnd={<span data-testid="icon-end">→</span>}
      >
        Navigate
      </Button>,
    )
    expect(screen.getByTestId('icon-start')).toBeInTheDocument()
    expect(screen.getByTestId('icon-end')).toBeInTheDocument()
  })

  test('supports keyboard navigation', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Keyboard</Button>)
    const button = screen.getByRole('button')
    button.focus()
    expect(button).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('supports space key activation', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Space</Button>)
    const button = screen.getByRole('button')
    button.focus()
    await user.keyboard(' ')
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('forwards ref to button element', () => {
    const ref = jest.fn()
    render(<Button ref={ref}>Ref</Button>)
    expect(ref).toHaveBeenCalled()
    expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLButtonElement)
  })

  test('spreads additional props to button element', () => {
    render(<Button data-testid="custom-button">Props</Button>)
    expect(screen.getByTestId('custom-button')).toBeInTheDocument()
  })
})
