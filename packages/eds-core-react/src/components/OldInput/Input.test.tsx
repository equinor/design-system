/* eslint-disable no-undef */
import { render, cleanup, screen } from '@testing-library/react'
import 'jest-styled-components'
import '@testing-library/jest-dom'
import { axe } from 'jest-axe'
import styled from 'styled-components'
import { Input } from './Input'
import * as tokens from './Input.tokens'
import { trimSpaces } from '@equinor/eds-utils'

const {
  error: {
    states: { active: activeError },
  },
  success: {
    states: { active: activeSuccess },
  },
  warning: {
    states: { active: activeWarning },
  },
} = tokens

afterEach(cleanup)

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
    const inputNode = screen.getByLabelText(label)

    expect(inputNode).toHaveStyleRule(
      'outline',
      `${activeSuccess.outline.width} solid ${trimSpaces(
        activeSuccess.outline.color,
      )}`,
    )
  })

  it('Has correct outline on input when variant is warning', () => {
    const label = 'warning outline on input'
    render(
      <label>
        {label}
        <Input id="test-warning" variant="warning" />
      </label>,
    )
    const inputNode = screen.getByLabelText(label)

    expect(inputNode).toHaveStyleRule(
      'outline',
      `${activeWarning.outline.width} solid ${trimSpaces(
        activeWarning.outline.color,
      )}`,
    )
  })

  it('Has correct outline on input when variant is error', () => {
    const label = 'error outline on input'
    render(
      <label>
        {label}
        <Input id="test-error" variant="error" />
      </label>,
    )
    const inputNode = screen.getByLabelText(label)

    expect(inputNode).toHaveStyleRule(
      'outline',
      `${activeError.outline.width} solid ${trimSpaces(
        activeError.outline.color,
      )}`,
    )
  })

  const StyledTextField = styled(Input)`
    margin-top: 48px;
  `
  it('Can extend the css of the component', () => {
    render(
      <StyledTextField
        id="test-css-extend"
        variant="error"
        value="textfield"
        readOnly
      />,
    )

    expect(screen.getByDisplayValue('textfield')).toHaveStyleRule(
      'margin-top',
      '48px',
    )
  })
})
