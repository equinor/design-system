/* eslint-disable no-undef */
import * as React from 'react'
import { render, cleanup, fireEvent } from '@testing-library/react'
import 'jest-styled-components'
import styled from 'styled-components'
import { TextField } from '.'

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
    const inputElement = queryByDisplayValue(value) as HTMLInputElement

    expect(inputElement.value).toBe(value)
  })

  it('Has correct updated value when changed', () => {
    let value = 'Initial value'
    const newValue = 'Updated value'
    const onChangeHandler = (ele) => {
      // eslint-disable-next-line
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
