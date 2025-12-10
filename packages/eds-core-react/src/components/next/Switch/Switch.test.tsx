import { render, screen, fireEvent } from '@testing-library/react'
import { Switch } from './Switch'

describe('Switch', () => {
  it('renders with label', () => {
    render(<Switch label="Test Label" />)
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument()
  })

  it('toggles state when clicked', () => {
    const handleChange = jest.fn()
    render(<Switch label="Test Label" onChange={handleChange} />)

    const input = screen.getByLabelText('Test Label')
    fireEvent.click(input)

    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is passed', () => {
    render(<Switch label="Test Label" disabled />)
    const input = screen.getByLabelText('Test Label')
    expect(input).toBeDisabled()
  })

  it('renders checked when checked prop is passed', () => {
    render(<Switch label="Test Label" checked readOnly />)
    const input = screen.getByLabelText('Test Label')
    expect(input).toBeChecked()
  })

  it('applies correct data-color-appearance attribute', () => {
    const { container } = render(<Switch label="Test Label" color="danger" />)
    // The label element is the root and has the class 'eds-switch'
    const switchRoot = container.querySelector('.eds-switch')
    expect(switchRoot).toHaveAttribute('data-color-appearance', 'danger')
  })
})
