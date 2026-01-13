import { render, screen } from '@testing-library/react'
import { HelperMessage } from './HelperMessage'
import { Field, useFieldIds } from '../Field'

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

describe('HelperMessage with useFieldIds', () => {
  const FieldWithHelper = () => {
    const { inputId, helperMessageId, getDescribedBy } = useFieldIds('test')
    return (
      <Field>
        <Field.Label htmlFor={inputId}>Email</Field.Label>
        <input
          id={inputId}
          data-testid="input"
          aria-describedby={getDescribedBy({ hasHelperMessage: true })}
        />
        <HelperMessage id={helperMessageId}>Error message</HelperMessage>
      </Field>
    )
  }

  test('connects to input via aria-describedby', () => {
    render(<FieldWithHelper />)
    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('aria-describedby')
    expect(input.getAttribute('aria-describedby')).toContain(
      'test-helper-message',
    )
  })

  test('has correct id from useFieldIds', () => {
    render(<FieldWithHelper />)
    const helper = screen.getByText('Error message')
    expect(helper).toHaveAttribute('id', 'test-helper-message')
  })
})
