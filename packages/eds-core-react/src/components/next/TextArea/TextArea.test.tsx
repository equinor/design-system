import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe } from 'jest-axe'
import { TextArea } from '.'

describe('TextArea (next)', () => {
  describe('Rendering', () => {
    it('renders a textarea element', () => {
      render(<TextArea data-testid="eds-textarea" />)
      expect(screen.getByTestId('eds-textarea').tagName).toBe('TEXTAREA')
    })

    it('renders with label', () => {
      render(<TextArea label="Description" />)
      expect(screen.getByText('Description')).toBeInTheDocument()
    })

    it('renders with helper message', () => {
      render(<TextArea helperMessage="Helper text" />)
      expect(screen.getByText('Helper text')).toBeInTheDocument()
    })

    it('renders with description', () => {
      render(<TextArea description="More details" label="Label" />)
      expect(screen.getByText('More details')).toBeInTheDocument()
    })

    it('renders with placeholder', () => {
      render(<TextArea placeholder="Enter text" />)
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
    })

    it('forwards ref to textarea element', () => {
      const ref = { current: null as HTMLTextAreaElement | null }
      render(<TextArea ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
    })

    it('spreads additional props onto textarea', () => {
      render(<TextArea data-testid="ta" rows={5} />)
      expect(screen.getByTestId('ta')).toHaveAttribute('rows', '5')
    })

    it('renders label info tooltip button when labelInfo provided', () => {
      render(<TextArea label="Label" labelInfo="Extra info" />)
      expect(
        screen.getByRole('button', { name: 'More information' }),
      ).toBeInTheDocument()
    })

    it('renders indicator text', () => {
      render(<TextArea label="Label" indicator="(Required)" />)
      expect(screen.getByText('(Required)')).toBeInTheDocument()
    })
  })

  describe('States', () => {
    it('applies disabled attribute', () => {
      render(<TextArea data-testid="ta" disabled />)
      expect(screen.getByTestId('ta')).toBeDisabled()
    })

    it('sets aria-invalid when invalid', () => {
      render(<TextArea data-testid="ta" invalid />)
      expect(screen.getByTestId('ta')).toHaveAttribute('aria-invalid', 'true')
    })

    it('sets alert role on helper message when invalid', () => {
      render(<TextArea invalid helperMessage="Error message" />)
      expect(screen.getByRole('alert')).toHaveTextContent('Error message')
    })
  })

  describe('Accessibility', () => {
    it('associates label with textarea via htmlFor/id', () => {
      render(<TextArea label="Description" />)
      const textarea = screen.getByRole('textbox')
      const label = screen.getByText('Description')
      expect(label).toHaveAttribute('for', textarea.id)
    })

    it('has no accessibility violations with label', async () => {
      const { container } = render(
        <TextArea label="Description" placeholder="Enter text" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no accessibility violations in invalid state', async () => {
      const { container } = render(
        <TextArea label="Description" invalid helperMessage="Required field" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no accessibility violations when disabled', async () => {
      const { container } = render(<TextArea label="Description" disabled />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
