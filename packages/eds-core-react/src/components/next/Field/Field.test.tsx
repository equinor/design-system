import { render, screen, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Field } from './Field'
import { useFieldIds } from './useFieldIds'

describe('useFieldIds', () => {
  test('generates consistent IDs with same prefix', () => {
    const { result } = renderHook(() => useFieldIds())
    const { inputId, labelId, descriptionId, helperMessageId } = result.current
    const prefix = inputId.replace('-input', '')
    expect(labelId).toBe(`${prefix}-label`)
    expect(descriptionId).toBe(`${prefix}-description`)
    expect(helperMessageId).toBe(`${prefix}-helper-message`)
  })

  test('uses provided id as prefix', () => {
    const { result } = renderHook(() => useFieldIds('custom-id'))
    expect(result.current.inputId).toBe('custom-id-input')
    expect(result.current.labelId).toBe('custom-id-label')
    expect(result.current.descriptionId).toBe('custom-id-description')
    expect(result.current.helperMessageId).toBe('custom-id-helper-message')
  })

  test('getDescribedBy returns only descriptionId by default', () => {
    const { result } = renderHook(() => useFieldIds('test'))
    expect(result.current.getDescribedBy()).toBe('test-description')
  })

  test('getDescribedBy includes helperMessageId when hasHelperMessage is true', () => {
    const { result } = renderHook(() => useFieldIds('test'))
    expect(result.current.getDescribedBy({ hasHelperMessage: true })).toBe(
      'test-description test-helper-message',
    )
  })

  test('getDescribedBy returns undefined when hasDescription is false', () => {
    const { result } = renderHook(() => useFieldIds('test'))
    expect(
      result.current.getDescribedBy({ hasDescription: false }),
    ).toBeUndefined()
  })

  test('getDescribedBy handles all combinations correctly', () => {
    const { result } = renderHook(() => useFieldIds('test'))
    expect(
      result.current.getDescribedBy({
        hasDescription: false,
        hasHelperMessage: true,
      }),
    ).toBe('test-helper-message')
    expect(
      result.current.getDescribedBy({
        hasDescription: false,
        hasHelperMessage: false,
      }),
    ).toBeUndefined()
  })
})

describe('Field', () => {
  test('renders as div wrapper with eds-field class', () => {
    render(
      <Field data-testid="field">
        <span>Content</span>
      </Field>,
    )
    const field = screen.getByTestId('field')
    expect(field.tagName).toBe('DIV')
    expect(field).toHaveClass('eds-field')
  })

  test('sets data-disabled attribute when disabled', () => {
    render(
      <Field disabled data-testid="field">
        <span>Content</span>
      </Field>,
    )
    const field = screen.getByTestId('field')
    expect(field).toHaveAttribute('data-disabled', 'true')
  })

  test('sets data-position attribute when position is provided', () => {
    render(
      <Field position="start" data-testid="field">
        <span>Content</span>
      </Field>,
    )
    const field = screen.getByTestId('field')
    expect(field).toHaveAttribute('data-position', 'start')
  })

  test('forwards ref to wrapper div', () => {
    const ref = { current: null }
    render(
      <Field ref={ref}>
        <span>Content</span>
      </Field>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  test('applies custom className alongside eds-field', () => {
    render(
      <Field className="custom-class" data-testid="field">
        <span>Content</span>
      </Field>,
    )
    const field = screen.getByTestId('field')
    expect(field).toHaveClass('eds-field', 'custom-class')
  })

  test('spreads additional props to wrapper', () => {
    render(
      <Field data-testid="field" aria-label="Field wrapper">
        <span>Content</span>
      </Field>,
    )
    const field = screen.getByTestId('field')
    expect(field).toHaveAttribute('aria-label', 'Field wrapper')
  })
})

describe('Field.Label', () => {
  test('renders as label element', () => {
    render(<Field.Label htmlFor="test-input">Email</Field.Label>)
    const label = screen.getByText('Email')
    expect(label.tagName).toBe('LABEL')
  })

  test('associates with input via htmlFor', () => {
    render(<Field.Label htmlFor="my-input">Username</Field.Label>)
    const label = screen.getByText('Username')
    expect(label).toHaveAttribute('for', 'my-input')
  })

  test('shows indicator when provided', () => {
    render(
      <Field.Label htmlFor="test" indicator="(Required)">
        Required Field
      </Field.Label>,
    )
    expect(screen.getByText('(Required)')).toBeInTheDocument()
  })

  test('supports custom indicator text for i18n', () => {
    render(
      <Field.Label htmlFor="test" indicator="(Påkrevd)">
        Felt
      </Field.Label>,
    )
    expect(screen.getByText('(Påkrevd)')).toBeInTheDocument()
  })

  test('clicking label focuses associated input', async () => {
    render(
      <Field>
        <Field.Label htmlFor="test-input">Email</Field.Label>
        <input id="test-input" />
      </Field>,
    )
    await userEvent.click(screen.getByText('Email'))
    expect(screen.getByRole('textbox')).toHaveFocus()
  })
})

describe('Field.Description', () => {
  test('renders as paragraph element', () => {
    render(<Field.Description id="desc">Help text</Field.Description>)
    const description = screen.getByText('Help text')
    expect(description.tagName).toBe('P')
  })

  test('accepts id prop for aria-describedby linking', () => {
    render(
      <Field.Description id="my-description">Description</Field.Description>,
    )
    const description = screen.getByText('Description')
    expect(description).toHaveAttribute('id', 'my-description')
  })
})

describe('Field.HelperMessage', () => {
  test('renders as paragraph element', () => {
    render(<Field.HelperMessage id="helper">Error message</Field.HelperMessage>)
    const helper = screen.getByText('Error message')
    expect(helper.tagName).toBe('P')
  })

  test('accepts id prop for aria-describedby linking', () => {
    render(
      <Field.HelperMessage id="my-helper">Helper text</Field.HelperMessage>,
    )
    const helper = screen.getByText('Helper text')
    expect(helper).toHaveAttribute('id', 'my-helper')
  })

  test('applies disabled styling', () => {
    render(
      <Field.HelperMessage id="helper" disabled data-testid="helper">
        Disabled message
      </Field.HelperMessage>,
    )
    const helper = screen.getByTestId('helper')
    expect(helper).toHaveClass('eds-helper-message--disabled')
  })

  test('accepts role prop for accessibility', () => {
    render(
      <Field.HelperMessage id="helper" role="alert">
        Error
      </Field.HelperMessage>,
    )
    const helper = screen.getByRole('alert')
    expect(helper).toBeInTheDocument()
  })
})

describe('Integration: Field with useFieldIds', () => {
  const FieldWithHook = () => {
    const { inputId, descriptionId, helperMessageId, getDescribedBy } =
      useFieldIds('test')
    return (
      <Field>
        <Field.Label htmlFor={inputId}>Email</Field.Label>
        <Field.Description id={descriptionId}>Enter email</Field.Description>
        <input
          id={inputId}
          data-testid="input"
          aria-describedby={getDescribedBy({ hasHelperMessage: true })}
        />
        <Field.HelperMessage id={helperMessageId}>
          Invalid email
        </Field.HelperMessage>
      </Field>
    )
  }

  test('label is associated with input', () => {
    render(<FieldWithHook />)
    const label = screen.getByText('Email')
    const input = screen.getByTestId('input')
    expect(label).toHaveAttribute('for', input.id)
  })

  test('input has correct aria-describedby', () => {
    render(<FieldWithHook />)
    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute(
      'aria-describedby',
      'test-description test-helper-message',
    )
  })

  test('description and helper message have correct ids', () => {
    render(<FieldWithHook />)
    const description = screen.getByText('Enter email')
    const helper = screen.getByText('Invalid email')
    expect(description).toHaveAttribute('id', 'test-description')
    expect(helper).toHaveAttribute('id', 'test-helper-message')
  })
})

describe('Field position prop', () => {
  test('sets data-position="start" for checkbox-first layout', () => {
    render(
      <Field position="start" data-testid="field">
        <input type="checkbox" />
        <Field.Label htmlFor="check">Accept terms</Field.Label>
      </Field>,
    )
    const field = screen.getByTestId('field')
    expect(field).toHaveAttribute('data-position', 'start')
  })

  test('sets data-position="end" for label-first layout', () => {
    render(
      <Field position="end" data-testid="field">
        <Field.Label htmlFor="check">Accept terms</Field.Label>
        <input type="checkbox" />
      </Field>,
    )
    const field = screen.getByTestId('field')
    expect(field).toHaveAttribute('data-position', 'end')
  })

  test('does not set data-position when not provided', () => {
    render(
      <Field data-testid="field">
        <Field.Label htmlFor="email">Email</Field.Label>
        <input />
      </Field>,
    )
    const field = screen.getByTestId('field')
    expect(field).not.toHaveAttribute('data-position')
  })
})
