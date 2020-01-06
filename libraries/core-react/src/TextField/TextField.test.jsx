/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup, fireEvent } from '@testing-library/react'
import 'jest-styled-components'
import styled from 'styled-components'
import { TextField } from '.'
import { input as inputTokens } from './Input/Input.tokens'

const {
  error: errorToken,
  success: successToken,
  warning: warningToken,
} = inputTokens

afterEach(cleanup)

describe('TextField', () => {
  it('Has correct label text', () => {
    const labelText = 'Some label'
    const { queryByText } = render(
      <TextField id="test-label" label={labelText} />,
    )

    expect(queryByText(labelText)).toBeInTheDocument()
  })

  it('Has correct default value', () => {
    const value = 'Some value'
    const { queryByDisplayValue } = render(
      <TextField id="test-value" value={value} readOnly />,
    )

    expect(queryByDisplayValue(value).value).toBe(value)
  })

  it('Has correct updated value when changed', () => {
    let value = 'Initial value'
    const newValue = 'Updated value'
    const onChangeHandler = (ele) => {
      // eslint-disable-next-line prefer-destructuring
      value = ele.target.value
    }

    const { getByDisplayValue } = render(
      <TextField
        id="test-value-updated"
        value={value}
        onChange={onChangeHandler}
      />,
    )

    fireEvent.change(getByDisplayValue(value), {
      target: { value: newValue },
    })

    expect(value).toBe(newValue)
  })

  it('Has correct outline on input when variant is success', () => {
    const label = 'success outline on input'
    const { getByLabelText } = render(
      <TextField id="test-warning" variant="success" label={label} />,
    )
    const inputNode = getByLabelText(label)

    expect(inputNode).toHaveStyleRule(
      'outline',
      `${successToken.border.width} solid ${successToken.border.color}`,
    )
  })

  it('Has correct outline on input when variant is warning', () => {
    const label = 'warning outline on input'
    const { getByLabelText } = render(
      <TextField id="test-warning" variant="warning" label={label} />,
    )
    const inputNode = getByLabelText(label)

    expect(inputNode).toHaveStyleRule(
      'outline',
      `${warningToken.border.width} solid ${warningToken.border.color}`,
    )
  })

  it('Has correct outline on input when variant is error', () => {
    const label = 'error outline on input'
    const { getByLabelText } = render(
      <TextField id="test-error" variant="error" label={label} />,
    )
    const inputNode = getByLabelText(label)

    expect(inputNode).toHaveStyleRule(
      'outline',
      `${errorToken.border.width} solid ${errorToken.border.color}`,
    )
  })

  const StyledTextField = styled(TextField)`
    margin-top: 48px;
  `
  it('Can extend the css of the component', () => {
    const { container } = render(
      <StyledTextField id="test-css-extend" variant="error" />,
    )

    expect(container.firstChild).toHaveStyleRule('margin-top', '48px')
  })
})
