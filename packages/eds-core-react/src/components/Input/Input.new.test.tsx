import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Input } from './Input.new'
import * as tokens from './Input.tokens'

describe('Input (New)', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(<Input value="input value" readOnly />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('Should pass a11y test when using label', async () => {
    const { container } = render(
      <label>
        Label text
        <Input />
      </label>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('Should pass a11y test when using aria-label', async () => {
    const { container } = render(<Input aria-label="description" />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('Has correct default value', () => {
    const value = 'Some value'
    render(<Input id="test-value" value={value} readOnly />)
    const inputElement: HTMLInputElement = screen.queryByDisplayValue(value)
    expect(inputElement.value).toBe(value)
  })

  it('Has correct outline on input when variant is success', () => {
    const label = 'success outline on input'
    render(
      <label>
        {label}
        <Input id="test-success" variant="success" />
      </label>,
    )
    const inputWrapper = screen.getByLabelText(label).parentElement
    expect(inputWrapper).toHaveStyle({
      '--eds-input-outline-color': tokens.success.outline.color,
    })
  })

  it('Has correct outline on input when variant is warning', () => {
    const label = 'warning outline on input'
    render(
      <label>
        {label}
        <Input id="test-warning" variant="warning" />
      </label>,
    )
    const inputWrapper = screen.getByLabelText(label).parentElement
    expect(inputWrapper).toHaveStyle({
      '--eds-input-outline-color': tokens.warning.outline.color,
    })
  })

  it('Has correct outline on input when variant is error', () => {
    const label = 'error outline on input'
    render(
      <label>
        {label}
        <Input id="test-error" variant="error" />
      </label>,
    )
    const inputWrapper = screen.getByLabelText(label).parentElement
    expect(inputWrapper).toHaveStyle({
      '--eds-input-outline-color': tokens.error.outline.color,
    })
  })

  it('Can extend the css of the component', () => {
    render(
      <Input
        id="test-css-extend"
        variant="error"
        value="textfield"
        className="custom-class"
        style={{ marginTop: '48px' }}
        readOnly
      />,
    )
    const inputWrapper = screen.getByDisplayValue('textfield').parentElement
    expect(inputWrapper).toHaveClass('custom-class')
    expect(inputWrapper).toHaveStyle({ marginTop: '48px' })
  })

  it('Renders left adornments', () => {
    render(
      <Input
        id="test-left-adornment"
        leftAdornments={<span>$</span>}
        value="100"
        readOnly
      />,
    )
    expect(screen.getByText('$')).toBeInTheDocument()
  })

  it('Renders right adornments', () => {
    render(
      <Input
        id="test-right-adornment"
        rightAdornments={<span>kg</span>}
        value="50"
        readOnly
      />,
    )
    expect(screen.getByText('kg')).toBeInTheDocument()
  })

  it('Renders as textarea when as prop is textarea', () => {
    render(<Input as="textarea" value="multiline text" readOnly />)
    const textarea = screen.getByDisplayValue('multiline text')
    expect(textarea.tagName).toBe('TEXTAREA')
  })

  it('Has disabled class when disabled', () => {
    const label = 'disabled input'
    render(
      <label>
        {label}
        <Input disabled />
      </label>,
    )
    const inputWrapper = screen.getByLabelText(label).parentElement
    expect(inputWrapper).toHaveClass('eds-input--disabled')
  })

  it('Has readonly class when readOnly', () => {
    const label = 'readonly input'
    render(
      <label>
        {label}
        <Input readOnly />
      </label>,
    )
    const inputWrapper = screen.getByLabelText(label).parentElement
    expect(inputWrapper).toHaveClass('eds-input--readonly')
  })
})
