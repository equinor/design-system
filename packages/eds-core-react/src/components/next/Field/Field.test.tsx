import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Field } from './Field'
import { HelperMessage } from '../HelperMessage'

describe('Field', () => {
  test('renders label and associates it with control', () => {
    render(
      <Field>
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <input data-testid="input" />
        </Field.Control>
      </Field>,
    )
    const input = screen.getByTestId('input')
    const label = screen.getByText('Email')
    expect(label).toBeInTheDocument()
    expect(input).toHaveAttribute('id')
    expect(label).toHaveAttribute('for', input.id)
  })

  test('renders description and links it via aria-describedby', () => {
    render(
      <Field>
        <Field.Label>Password</Field.Label>
        <Field.Description>Must be at least 8 characters</Field.Description>
        <Field.Control>
          <input data-testid="input" />
        </Field.Control>
      </Field>,
    )
    const description = screen.getByText('Must be at least 8 characters')
    const input = screen.getByTestId('input')
    expect(description).toBeInTheDocument()
    expect(input.getAttribute('aria-describedby')).toContain(description.id)
  })

  test('sets aria-required on control when required prop is true', () => {
    render(
      <Field required>
        <Field.Label>Name</Field.Label>
        <Field.Control>
          <input data-testid="input" />
        </Field.Control>
      </Field>,
    )
    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('aria-required', 'true')
  })

  test('sets data-required attribute on field wrapper when required', () => {
    render(
      <Field required data-testid="field">
        <Field.Label>Username</Field.Label>
        <Field.Control>
          <input />
        </Field.Control>
      </Field>,
    )
    const field = screen.getByTestId('field')
    expect(field).toHaveAttribute('data-required', 'true')
  })

  test('sets data-disabled attribute on field wrapper when disabled', () => {
    render(
      <Field disabled data-testid="field">
        <Field.Label>Username</Field.Label>
        <Field.Control>
          <input />
        </Field.Control>
      </Field>,
    )
    const field = screen.getByTestId('field')
    expect(field).toHaveAttribute('data-disabled', 'true')
  })

  test('links helper message via aria-describedby', () => {
    render(
      <Field>
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <input data-testid="input" />
        </Field.Control>
        <HelperMessage data-testid="helper">Error message</HelperMessage>
      </Field>,
    )
    const input = screen.getByTestId('input')
    const helper = screen.getByTestId('helper')
    expect(input.getAttribute('aria-describedby')).toContain(helper.id)
  })

  test('combines description and helper message in aria-describedby', () => {
    render(
      <Field>
        <Field.Label>Password</Field.Label>
        <Field.Description data-testid="description">
          Must be 8+ chars
        </Field.Description>
        <Field.Control>
          <input data-testid="input" />
        </Field.Control>
        <HelperMessage data-testid="helper">Too short</HelperMessage>
      </Field>,
    )
    const input = screen.getByTestId('input')
    const description = screen.getByTestId('description')
    const helper = screen.getByTestId('helper')
    const describedBy = input.getAttribute('aria-describedby') ?? ''
    const ids = describedBy.split(' ').filter(Boolean)
    expect(ids).toHaveLength(2)
    expect(describedBy).toContain(description.id)
    expect(describedBy).toContain(helper.id)
  })

  test('forwards ref to wrapper div', () => {
    const ref = { current: null }
    render(
      <Field ref={ref}>
        <Field.Label>Label</Field.Label>
        <Field.Control>
          <input />
        </Field.Control>
      </Field>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  test('applies custom className', () => {
    render(
      <Field className="custom-class" data-testid="field">
        <Field.Label>Label</Field.Label>
        <Field.Control>
          <input />
        </Field.Control>
      </Field>,
    )
    const field = screen.getByTestId('field')
    expect(field).toHaveClass('eds-field', 'custom-class')
  })
})

describe('Field.Label', () => {
  test('shows indicator when provided', () => {
    render(
      <Field>
        <Field.Label indicator="(Required)">Required Field</Field.Label>
        <Field.Control>
          <input />
        </Field.Control>
      </Field>,
    )
    expect(screen.getByText('(Required)')).toBeInTheDocument()
  })

  test('shows custom indicator text for i18n', () => {
    render(
      <Field>
        <Field.Label indicator="(Valgfritt)">Valgfritt felt</Field.Label>
        <Field.Control>
          <input />
        </Field.Control>
      </Field>,
    )
    expect(screen.getByText('(Valgfritt)')).toBeInTheDocument()
  })

  test('does not show indicator when not provided', () => {
    render(
      <Field>
        <Field.Label>Field without indicator</Field.Label>
        <Field.Control>
          <input />
        </Field.Control>
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
        <Field.Control>
          <input />
        </Field.Control>
      </Field>,
    )
    expect(screen.getByText('Help text')).toBeInTheDocument()
  })

  test('has unique id for aria-describedby linking', () => {
    render(
      <Field>
        <Field.Label>Label</Field.Label>
        <Field.Description>Description</Field.Description>
        <Field.Control>
          <input />
        </Field.Control>
      </Field>,
    )
    const description = screen.getByText('Description')
    expect(description).toHaveAttribute('id')
  })

  test('ignores custom id within Field context to keep aria-describedby in sync', () => {
    render(
      <Field>
        <Field.Label>Label</Field.Label>
        <Field.Description id="custom-desc">Description</Field.Description>
        <Field.Control>
          <input data-testid="input" />
        </Field.Control>
      </Field>,
    )
    const description = screen.getByText('Description')
    const input = screen.getByTestId('input')
    // Custom id is ignored - context id is used to keep aria-describedby in sync
    expect(description).not.toHaveAttribute('id', 'custom-desc')
    expect(input.getAttribute('aria-describedby')).toContain(description.id)
  })
})

describe('Error handling', () => {
  // Suppress console.error for expected errors in these tests
  const originalError = console.error
  beforeAll(() => {
    console.error = jest.fn()
  })
  afterAll(() => {
    console.error = originalError
  })

  test('Field.Label throws when used outside Field', () => {
    expect(() => render(<Field.Label>Label</Field.Label>)).toThrow(
      'Field components must be used within a Field',
    )
  })

  test('Field.Description throws when used outside Field', () => {
    expect(() =>
      render(<Field.Description>Description</Field.Description>),
    ).toThrow('Field components must be used within a Field')
  })

  test('Field.Control throws when used outside Field', () => {
    expect(() =>
      render(
        <Field.Control>
          <input />
        </Field.Control>,
      ),
    ).toThrow('Field components must be used within a Field')
  })
})

describe('Field.Control edge cases', () => {
  test('merges existing aria-describedby with Field context', () => {
    render(
      <Field>
        <Field.Label>Email</Field.Label>
        <Field.Description data-testid="description">
          Enter your email
        </Field.Description>
        <Field.Control>
          <input data-testid="input" aria-describedby="external-hint" />
        </Field.Control>
      </Field>,
    )
    const input = screen.getByTestId('input')
    const description = screen.getByTestId('description')
    const describedBy = input.getAttribute('aria-describedby') ?? ''
    expect(describedBy).toContain(description.id)
    expect(describedBy).toContain('external-hint')
  })

  test('preserves existing id on child element', () => {
    render(
      <Field>
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <input data-testid="input" id="my-custom-id" />
        </Field.Control>
      </Field>,
    )
    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('id', 'my-custom-id')
  })

  test('preserves existing disabled state on child element', () => {
    render(
      <Field>
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <input data-testid="input" disabled />
        </Field.Control>
      </Field>,
    )
    const input = screen.getByTestId('input')
    expect(input).toBeDisabled()
  })

  test('preserves existing aria-required on child element', () => {
    render(
      <Field>
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <input data-testid="input" aria-required="true" />
        </Field.Control>
      </Field>,
    )
    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('aria-required', 'true')
  })

  test('passes disabled prop from Field to input element', () => {
    render(
      <Field disabled>
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <input data-testid="input" />
        </Field.Control>
      </Field>,
    )
    const input = screen.getByTestId('input')
    expect(input).toBeDisabled()
  })
})

describe('Field position prop', () => {
  test('sets data-position="start" for horizontal layout', () => {
    render(
      <Field position="start" data-testid="field">
        <Field.Control>
          <input type="checkbox" />
        </Field.Control>
        <Field.Label>Accept terms</Field.Label>
      </Field>,
    )
    const field = screen.getByTestId('field')
    expect(field).toHaveAttribute('data-position', 'start')
  })

  test('sets data-position="end" for horizontal layout', () => {
    render(
      <Field position="end" data-testid="field">
        <Field.Label>Accept terms</Field.Label>
        <Field.Control>
          <input type="checkbox" />
        </Field.Control>
      </Field>,
    )
    const field = screen.getByTestId('field')
    expect(field).toHaveAttribute('data-position', 'end')
  })

  test('does not set data-position when position prop is not provided', () => {
    render(
      <Field data-testid="field">
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <input />
        </Field.Control>
      </Field>,
    )
    const field = screen.getByTestId('field')
    expect(field).not.toHaveAttribute('data-position')
  })
})
