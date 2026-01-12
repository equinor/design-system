import { render, screen } from '@testing-library/react'
import { HelperMessage } from './HelperMessage'
import { Field } from '../Field'

describe('HelperMessage', () => {
  test('renders helper message text', () => {
    render(<HelperMessage>Error occurred</HelperMessage>)
    expect(screen.getByText('Error occurred')).toBeInTheDocument()
  })

  test('allows custom role', () => {
    render(<HelperMessage role="alert">Error message</HelperMessage>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  test('applies custom className', () => {
    render(
      <HelperMessage className="custom-class" data-testid="message">
        Message
      </HelperMessage>,
    )
    expect(screen.getByTestId('message')).toHaveClass(
      'eds-helper-message',
      'custom-class',
    )
  })

  test('forwards ref to paragraph element', () => {
    const ref = { current: null }
    render(<HelperMessage ref={ref}>Message</HelperMessage>)
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement)
  })

  test('uses custom id when provided', () => {
    render(
      <HelperMessage id="custom-id" data-testid="message">
        Message
      </HelperMessage>,
    )
    expect(screen.getByTestId('message')).toHaveAttribute('id', 'custom-id')
  })

  test('applies disabled class when disabled', () => {
    render(
      <HelperMessage disabled data-testid="message">
        Disabled message
      </HelperMessage>,
    )
    expect(screen.getByTestId('message')).toHaveClass(
      'eds-helper-message--disabled',
    )
  })
})

describe('HelperMessage within Field', () => {
  test('registers with Field context for aria-describedby', () => {
    render(
      <Field>
        <Field.Label>Label</Field.Label>
        <Field.Control>
          <input data-testid="input" />
        </Field.Control>
        <HelperMessage>Error message</HelperMessage>
      </Field>,
    )
    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('aria-describedby')
  })
})
