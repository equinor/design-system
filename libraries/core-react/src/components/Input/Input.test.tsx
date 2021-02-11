/* eslint-disable no-undef */
import * as React from 'react'
import { render, cleanup } from '@testing-library/react'
import 'jest-styled-components'
import styled from 'styled-components'
import { Input } from './Input'
import { input as inputTokens } from './Input.tokens'

const {
  error: errorToken,
  success: successToken,
  warning: warningToken,
} = inputTokens

afterEach(cleanup)

describe('Input', () => {
  it('Has correct default value', () => {
    const value = 'Some value'
    const { queryByDisplayValue } = render(
      <Input id="test-value" value={value} readOnly />,
    )
    const inputElement = queryByDisplayValue(value) as HTMLInputElement

    expect(inputElement.value).toBe(value)
  })

  it('Has correct outline on input when variant is success', () => {
    const label = 'success outline on input'
    const { getByLabelText } = render(
      <label>
        {label}
        <Input id="test-warning" variant="success" />,
      </label>,
    )
    const inputNode = getByLabelText(label)

    expect(inputNode).toHaveStyleRule(
      'outline',
      `${successToken.border.outline.width} solid ${successToken.border.outline.color}`,
    )
  })

  it('Has correct outline on input when variant is warning', () => {
    const label = 'warning outline on input'
    const { getByLabelText } = render(
      <label>
        {label}
        <Input id="test-warning" variant="warning" />
      </label>,
    )
    const inputNode = getByLabelText(label)

    expect(inputNode).toHaveStyleRule(
      'outline',
      `${warningToken.border.outline.width} solid ${warningToken.border.outline.color}`,
    )
  })

  it('Has correct outline on input when variant is error', () => {
    const label = 'error outline on input'
    const { getByLabelText } = render(
      <label>
        {label}
        <Input id="test-error" variant="error" />
      </label>,
    )
    const inputNode = getByLabelText(label)

    expect(inputNode).toHaveStyleRule(
      'outline',
      `${errorToken.border.outline.width} solid ${errorToken.border.outline.color}`,
    )
  })

  const StyledTextField = styled(Input)`
    margin-top: 48px;
  `
  it('Can extend the css of the component', () => {
    const { container } = render(
      <StyledTextField id="test-css-extend" variant="error" />,
    )

    expect(container.firstChild).toHaveStyleRule('margin-top', '48px')
  })
})
