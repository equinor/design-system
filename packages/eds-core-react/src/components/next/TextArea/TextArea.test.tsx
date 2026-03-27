import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe } from 'jest-axe'
import { TextArea } from '.'

describe('TextArea (next)', () => {
  describe('Rendering', () => {
    it('renders a textarea element', () => {
      render(<TextArea />)
      expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA')
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
      render(<TextArea rows={5} />)
      expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5')
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

  describe('Character count', () => {
    it('shows character count when showCharacterCount is true', () => {
      render(<TextArea showCharacterCount defaultValue="hello" />)
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('shows character count with max when maxLength is set', () => {
      render(
        <TextArea showCharacterCount maxLength={100} defaultValue="hello" />,
      )
      expect(screen.getByText('5 / 100')).toBeInTheDocument()
    })

    it('updates count on change', () => {
      render(<TextArea showCharacterCount />)
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'abc' },
      })
      expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('does not show char count when showCharacterCount is not set', () => {
      render(<TextArea label="Label" defaultValue="hello" />)
      expect(screen.queryByText('5')).not.toBeInTheDocument()
    })

    it('syncs count when controlled value changes externally', () => {
      const { rerender } = render(
        <TextArea
          showCharacterCount
          value="hello"
          onChange={() => undefined}
        />,
      )
      expect(screen.getByText('5')).toBeInTheDocument()
      rerender(
        <TextArea showCharacterCount value="" onChange={() => undefined} />,
      )
      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })

  describe('States', () => {
    it('applies disabled attribute', () => {
      render(<TextArea disabled />)
      expect(screen.getByRole('textbox')).toBeDisabled()
    })

    it('sets aria-invalid when invalid', () => {
      render(<TextArea invalid />)
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-invalid',
        'true',
      )
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
