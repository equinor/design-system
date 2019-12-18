/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import { tokens } from '@equinor/eds-tokens'
import styled from 'styled-components'
import { Divider } from '.'

const StyledDivider = styled(Divider)`
  position: relative;
`

const {
  colors: {
    ui: {
      background__default: { hex: lighter },
      background__light: { hex: light },
      background__medium: { hex: medium },
    },
  },
  spacings: {
    comfortable: { small: spacingSmall, medium: spacingMedium },
  },
} = tokens

afterEach(cleanup)

describe('Divider', () => {
  it('Has medium colour and medium spacing as default', () => {
    const { container } = render(<Divider />)
    expect(container.firstChild).toHaveStyleRule('background-color', medium)
    expect(container.firstChild).toHaveStyleRule('margin-top', spacingMedium)
  })
  it('Sets backgroundColor to light according to color prop', () => {
    const { container } = render(<Divider color="light" />)
    expect(container.firstChild).toHaveStyleRule('background-color', light)
  })
  it('Sets backgroundColor to lighter according to color prop', () => {
    const { container } = render(<Divider color="lighter" />)
    expect(container.firstChild).toHaveStyleRule('background-color', lighter)
  })
  it('Sets topMargin to small according to variant prop', () => {
    const { container } = render(<Divider variant="small" />)
    expect(container.firstChild).toHaveStyleRule('margin-top', spacingSmall)
  })
  it('Can extend the css for the component', () => {
    const { container } = render(<StyledDivider variant="small" />)
    expect(container.firstChild).toHaveStyleRule('position', 'relative')
    expect(container.firstChild).toHaveStyleRule('margin-top', spacingSmall)
  })
})
