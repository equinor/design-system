import React from 'react'
import { render, cleanup, fireEvent } from '@testing-library/react'
import 'jest-styled-components'
import { tokens } from '@equinor/eds-tokens'
import { TextField } from '.'

// const {
//   spacings: { small: smallSpace, medium: mediumSpace },
//   colors: {
//     ui: {
//       background__default: { hex: whiteColor },
//       background__light: { hex: lightColor },
//       background__medium: { hex: mediumColor },
//     },
//   },
// } = tokens

afterEach(cleanup)

describe('TextField', () => {
  it('Has medium colour as default', () => {
    const labelText = 'Some label'
    const { getByText } = render(<TextField id="test1" label={labelText} />)
    expect(getByText(labelText)).toBeInTheDocument()
  })
  // it('Has light colour when color attribute is light', () => {
  //   const { container } = render(<Divider color="light" />)
  //   expect(container.firstChild).toHaveStyleRule('background-color', lightColor)
  // })
  // it('Has white colour when color attribute is bright', () => {
  //   const { container } = render(<Divider color="bright" />)
  //   expect(container.firstChild).toHaveStyleRule('background-color', whiteColor)
  // })
})
