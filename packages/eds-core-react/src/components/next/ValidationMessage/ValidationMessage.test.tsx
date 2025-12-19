import { render, screen } from '@testing-library/react'
import { ValidationMessage } from './ValidationMessage'
import { Field } from '../Field'

describe('ValidationMessage', () => {
  test('renders validation message text', () => {
    render(<ValidationMessage>Error occurred</ValidationMessage>)
    expect(screen.getByText('Error occurred')).toBeInTheDocument()
  })

  test('allows custom role', () => {
    render(<ValidationMessage role="alert">Error message</ValidationMessage>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  test('applies custom className', () => {
    render(
      <ValidationMessage className="custom-class" data-testid="message">
        Message
      </ValidationMessage>,
    )
    expect(screen.getByTestId('message')).toHaveClass(
      'eds-validation-message',
      'custom-class',
    )
  })

  test('forwards ref to paragraph element', () => {
    const ref = { current: null }
    render(<ValidationMessage ref={ref}>Message</ValidationMessage>)
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement)
  })

  test('uses custom id when provided', () => {
    render(
      <ValidationMessage id="custom-id" data-testid="message">
        Message
      </ValidationMessage>,
    )
    expect(screen.getByTestId('message')).toHaveAttribute('id', 'custom-id')
  })

  test('applies disabled class when disabled', () => {
    render(
      <ValidationMessage disabled data-testid="message">
        Disabled message
      </ValidationMessage>,
    )
    expect(screen.getByTestId('message')).toHaveClass(
      'eds-validation-message--disabled',
    )
  })
})

describe('ValidationMessage within Field', () => {
  test('registers with Field context for aria-describedby', () => {
    render(
      <Field>
        <Field.Label>Label</Field.Label>
        <Field.Control>
          <input data-testid="input" />
        </Field.Control>
        <ValidationMessage>Error message</ValidationMessage>
      </Field>,
    )
    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('aria-describedby')
  })
})
