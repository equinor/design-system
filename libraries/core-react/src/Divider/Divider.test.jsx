import React from 'react'
import { render, cleanup } from '@testing-library/react'
// import '@testing-library/jest-dom'
import 'jest-styled-components'
import { tokens } from '@equinor/eds-tokens'
import { Divider } from '.'

const {
  spacings: { small: smallSpace, medium: mediumSpace },
  colors: {
    ui: {
      background__default: { hex: whiteColor },
      background__light: { hex: lightColor },
      background__medium: { hex: mediumColor },
    },
  },
} = tokens

afterEach(cleanup)

describe('Divider', () => {
  it('Has medium colour as default', () => {
    const { container } = render(<Divider />)
    expect(container.firstChild).toHaveStyleRule(
      'background-color',
      mediumColor,
    )
  })
  it('Has light colour when color attribute is light', () => {
    const { container } = render(<Divider color="light" />)
    expect(container.firstChild).toHaveStyleRule('background-color', lightColor)
  })
  it('Has white colour when color attribute is lighter', () => {
    const { container } = render(<Divider color="lighter" />)
    expect(container.firstChild).toHaveStyleRule('background-color', whiteColor)
  })
})
