/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Input } from './Input'
import * as tokens from './Input.tokens'

describe('Input', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(<Input value="input value" readOnly />)
    expect(asFragment()).toMatchSnapshot()
  })
  it('Should pass a11y test when using label', async () => {
    const { container } = render(
      // eslint-disable-next-line jsx-a11y/label-has-associated-control
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
    // eslint-disable-next-line testing-library/no-node-access
    const inputWrapper = screen.getByLabelText(label).parentElement

    expect(inputWrapper).toHaveStyle({
      outline: `${tokens.input.outline.width} solid ${tokens.success.outline.color}`,
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
    // eslint-disable-next-line testing-library/no-node-access
    const inputWrapper = screen.getByLabelText(label).parentElement

    expect(inputWrapper).toHaveStyle({
      outline: `${tokens.input.outline.width} solid ${tokens.warning.outline.color}`,
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
    // eslint-disable-next-line testing-library/no-node-access
    const inputWrapper = screen.getByLabelText(label).parentElement

    expect(inputWrapper).toHaveStyle({
      outline: `${tokens.input.outline.width} solid ${tokens.error.outline.color}`,
    })
  })

  it('Can extend the css of the component', () => {
    render(
      <Input
        id="test-css-extend"
        variant="error"
        value="textfield"
        readOnly
        className="custom-input"
        style={{ marginTop: '48px' }}
      />,
    )

    // eslint-disable-next-line testing-library/no-node-access
    const inputWrapper = screen.getByDisplayValue('textfield').parentElement

    expect(inputWrapper).toHaveStyle({ marginTop: '48px' })
    expect(inputWrapper).toHaveClass('custom-input')
  })
})
