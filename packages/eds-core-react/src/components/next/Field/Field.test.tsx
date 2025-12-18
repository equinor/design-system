import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Field } from './Field'
import { ValidationMessage } from '../ValidationMessage'

describe('Field', () => {
  test('renders label and associates it with control', () => {
    render(
      <Field>
        <Field.Label indicator="">Email</Field.Label>
        <input data-testid="input" />
      </Field>,
    )
    const label = screen.getByLabelText('Email')
    const input = screen.getByTestId('input')
    expect(label).toBeInTheDocument()
    expect(input).toHaveAttribute('id')
  })

  test('renders description and links it via aria-describedby', () => {
    render(
      <Field>
        <Field.Label>Password</Field.Label>
        <Field.Description>Must be at least 8 characters</Field.Description>
        <input data-testid="input" />
      </Field>,
    )
    const description = screen.getByText('Must be at least 8 characters')
    const input = screen.getByTestId('input')
    expect(description).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-describedby', description.id)
  })

  test('sets aria-required on control when required prop is true', () => {
    render(
      <Field required>
        <Field.Label>Name</Field.Label>
        <input data-testid="input" />
      </Field>,
    )
    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('aria-required', 'true')
    expect(input).toHaveAttribute('required')
  })

  test('sets disabled on control when disabled prop is true', () => {
    render(
      <Field disabled>
        <Field.Label>Username</Field.Label>
        <input data-testid="input" />
      </Field>,
    )
    const input = screen.getByTestId('input')
    expect(input).toBeDisabled()
  })

  test('sets data-disabled attribute on field wrapper when disabled', () => {
    render(
      <Field disabled data-testid="field">
        <Field.Label>Username</Field.Label>
        <input />
      </Field>,
    )
    const field = screen.getByTestId('field')
    expect(field).toHaveAttribute('data-disabled', 'true')
  })

  test('sets aria-invalid when ValidationMessage with danger tone is present', () => {
    render(
      <Field>
        <Field.Label>Email</Field.Label>
        <input data-testid="input" />
        <ValidationMessage tone="danger">Invalid email</ValidationMessage>
      </Field>,
    )
    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  test('does not set aria-invalid for non-danger tones', () => {
    render(
      <Field>
        <Field.Label>Email</Field.Label>
        <input data-testid="input" />
        <ValidationMessage tone="warning">Check this</ValidationMessage>
      </Field>,
    )
    const input = screen.getByTestId('input')
    expect(input).not.toHaveAttribute('aria-invalid')
  })

  test('links validation message via aria-describedby', () => {
    render(
      <Field>
        <Field.Label>Email</Field.Label>
        <input data-testid="input" />
        <ValidationMessage data-testid="validation">
          Error message
        </ValidationMessage>
      </Field>,
    )
    const input = screen.getByTestId('input')
    const validation = screen.getByTestId('validation')
    expect(input.getAttribute('aria-describedby')).toContain(validation.id)
  })

  test('combines description and validation in aria-describedby', () => {
    render(
      <Field>
        <Field.Label>Password</Field.Label>
        <Field.Description>Must be 8+ chars</Field.Description>
        <input data-testid="input" />
        <ValidationMessage>Too short</ValidationMessage>
      </Field>,
    )
    const input = screen.getByTestId('input')
    const describedBy = input.getAttribute('aria-describedby') ?? ''
    expect(describedBy.split(' ')).toHaveLength(2)
  })

  test('uses custom controlId when provided', () => {
    render(
      <Field controlId="custom-id">
        <Field.Label>Field</Field.Label>
        <input data-testid="input" />
      </Field>,
    )
    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('id', 'custom-id')
  })

  test('forwards ref to wrapper div', () => {
    const ref = { current: null }
    render(
      <Field ref={ref}>
        <Field.Label>Label</Field.Label>
        <input />
      </Field>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  test('applies custom className', () => {
    render(
      <Field className="custom-class" data-testid="field">
        <Field.Label>Label</Field.Label>
        <input />
      </Field>,
    )
    const field = screen.getByTestId('field')
    expect(field).toHaveClass('eds-field', 'custom-class')
  })
})

describe('Field.Label', () => {
  test('shows (Required) indicator when field is required', () => {
    render(
      <Field required>
        <Field.Label>Required Field</Field.Label>
        <input />
      </Field>,
    )
    expect(screen.getByText('(Required)')).toBeInTheDocument()
  })

  test('shows (Optional) indicator by default when field is not required', () => {
    render(
      <Field>
        <Field.Label>Optional Field</Field.Label>
        <input />
      </Field>,
    )
    expect(screen.getByText('(Optional)')).toBeInTheDocument()
  })

  test('uses custom indicator text for i18n', () => {
    render(
      <Field>
        <Field.Label indicator="(Valgfritt)">Valgfritt felt</Field.Label>
        <input />
      </Field>,
    )
    expect(screen.getByText('(Valgfritt)')).toBeInTheDocument()
  })

  test('hides indicator when set to empty string', () => {
    render(
      <Field required>
        <Field.Label indicator="">Field without indicator</Field.Label>
        <input />
      </Field>,
    )
    expect(screen.queryByText('(Required)')).not.toBeInTheDocument()
    expect(screen.queryByText('(Optional)')).not.toBeInTheDocument()
  })
})

describe('Field.Description', () => {
  test('renders description text', () => {
    render(
      <Field>
        <Field.Label>Label</Field.Label>
        <Field.Description>Help text</Field.Description>
        <input />
      </Field>,
    )
    expect(screen.getByText('Help text')).toBeInTheDocument()
  })

  test('has unique id for aria-describedby linking', () => {
    render(
      <Field>
        <Field.Label>Label</Field.Label>
        <Field.Description>Description</Field.Description>
        <input />
      </Field>,
    )
    const description = screen.getByText('Description')
    expect(description).toHaveAttribute('id')
  })

  test('uses custom id when provided', () => {
    render(
      <Field>
        <Field.Label>Label</Field.Label>
        <Field.Description id="custom-desc">Description</Field.Description>
        <input />
      </Field>,
    )
    expect(screen.getByText('Description')).toHaveAttribute('id', 'custom-desc')
  })
})
