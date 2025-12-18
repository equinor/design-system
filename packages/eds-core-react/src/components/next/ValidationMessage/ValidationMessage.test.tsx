import { render, screen } from '@testing-library/react'
import { ValidationMessage } from './ValidationMessage'
import { Field } from '../Field'

describe('ValidationMessage', () => {
  test('renders validation message text', () => {
    render(<ValidationMessage>Error occurred</ValidationMessage>)
    expect(screen.getByText('Error occurred')).toBeInTheDocument()
  })

  test('has role="alert" for danger tone by default', () => {
    render(<ValidationMessage>Error</ValidationMessage>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  test('has role="alert" for danger tone explicitly', () => {
    render(<ValidationMessage tone="danger">Error</ValidationMessage>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  test('does not have role="alert" for warning tone', () => {
    render(<ValidationMessage tone="warning">Warning</ValidationMessage>)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  test('does not have role="alert" for success tone', () => {
    render(<ValidationMessage tone="success">Success</ValidationMessage>)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  test('does not have role="alert" for info tone', () => {
    render(<ValidationMessage tone="info">Info</ValidationMessage>)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  test('allows custom role override', () => {
    render(
      <ValidationMessage tone="danger" role="status">
        Status message
      </ValidationMessage>,
    )
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  test('sets data-color-appearance attribute for danger', () => {
    render(<ValidationMessage tone="danger">Error</ValidationMessage>)
    const message = screen.getByRole('alert')
    expect(message).toHaveAttribute('data-color-appearance', 'danger')
  })

  test('sets data-color-appearance attribute for warning', () => {
    render(
      <ValidationMessage tone="warning" data-testid="message">
        Warning
      </ValidationMessage>,
    )
    expect(screen.getByTestId('message')).toHaveAttribute(
      'data-color-appearance',
      'warning',
    )
  })

  test('sets data-color-appearance attribute for success', () => {
    render(
      <ValidationMessage tone="success" data-testid="message">
        Success
      </ValidationMessage>,
    )
    expect(screen.getByTestId('message')).toHaveAttribute(
      'data-color-appearance',
      'success',
    )
  })

  test('sets data-color-appearance attribute for info', () => {
    render(
      <ValidationMessage tone="info" data-testid="message">
        Info
      </ValidationMessage>,
    )
    expect(screen.getByTestId('message')).toHaveAttribute(
      'data-color-appearance',
      'info',
    )
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

  test('forwards ref to wrapper div', () => {
    const ref = { current: null }
    render(<ValidationMessage ref={ref}>Message</ValidationMessage>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  test('uses custom id when provided', () => {
    render(
      <ValidationMessage id="custom-id" data-testid="message">
        Message
      </ValidationMessage>,
    )
    expect(screen.getByTestId('message')).toHaveAttribute('id', 'custom-id')
  })

  test('generates unique id when not provided', () => {
    render(<ValidationMessage data-testid="message">Message</ValidationMessage>)
    expect(screen.getByTestId('message')).toHaveAttribute('id')
  })
})

describe('ValidationMessage within Field', () => {
  test('adds eds-field__validation class when inside Field', () => {
    render(
      <Field>
        <Field.Label>Label</Field.Label>
        <input />
        <ValidationMessage data-testid="message">Error</ValidationMessage>
      </Field>,
    )
    expect(screen.getByTestId('message')).toHaveClass('eds-field__validation')
  })

  test('registers with Field context for aria-describedby', () => {
    render(
      <Field>
        <Field.Label>Label</Field.Label>
        <input data-testid="input" />
        <ValidationMessage>Error message</ValidationMessage>
      </Field>,
    )
    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('aria-describedby')
  })

  test('triggers aria-invalid on Field when tone is danger', () => {
    render(
      <Field>
        <Field.Label>Label</Field.Label>
        <input data-testid="input" />
        <ValidationMessage tone="danger">Error</ValidationMessage>
      </Field>,
    )
    expect(screen.getByTestId('input')).toHaveAttribute('aria-invalid', 'true')
  })

  test('does not trigger aria-invalid for non-danger tones', () => {
    render(
      <Field>
        <Field.Label>Label</Field.Label>
        <input data-testid="input" />
        <ValidationMessage tone="info">Info</ValidationMessage>
      </Field>,
    )
    expect(screen.getByTestId('input')).not.toHaveAttribute('aria-invalid')
  })
})
