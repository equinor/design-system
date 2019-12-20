import React from 'react'
import { render, cleanup } from '@testing-library/react'
import 'jest-styled-components'
import { TextField } from '.'
import { input as inputTokens } from './Input/Input.tokens'

const errorToken = inputTokens.error

const outlineError = `${errorToken.border.width} solid ${errorToken.border.color}`

afterEach(cleanup)

describe('TextField', () => {
  it('Has correct label text', () => {
    const labelText = 'Some label'
    const { getByText } = render(<TextField id="test1" label={labelText} />)
    expect(getByText(labelText)).toBeInTheDocument()
  })
  it('Has correct outline on input when variant is error', () => {
    const label = 'error outline on input'
    const { getByLabelText } = render(
      <TextField id="error-test-1" variant="error" label={label} />,
    )

    const inputNode = getByLabelText(label)
    expect(inputNode).toHaveStyleRule('outline', outlineError)
  })
})
