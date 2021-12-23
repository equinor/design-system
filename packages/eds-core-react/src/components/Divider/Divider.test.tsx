/* eslint-disable no-undef */
import { render, cleanup, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import * as tokens from './Divider.tokens'
import { Divider } from '.'
import { trimSpaces } from '../../utils'

const StyledDivider = styled(Divider)`
  position: relative;
`
const {
  divider: {
    lighter: { background: lighter },
    light: { background: light },
    mediumColor: { background: mediumColor },
  },
  small: {
    spacings: { top: spacingSmall },
  },
  medium: {
    spacings: { top: spacingMedium },
  },
} = tokens

afterEach(cleanup)

describe('Divider', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(<Divider />)
    expect(asFragment()).toMatchSnapshot()
  })
  it('Has medium colour and medium spacing as default', () => {
    render(<Divider />)
    const divider = screen.getByRole('separator')
    expect(divider).toHaveStyleRule('background-color', trimSpaces(mediumColor))
    expect(divider).toHaveStyleRule('margin-top', spacingMedium)
  })
  it('Sets backgroundColor to light according to color prop', () => {
    render(<Divider color="light" />)
    const divider = screen.getByRole('separator')

    expect(divider).toHaveStyleRule('background-color', trimSpaces(light))
  })
  it('Sets backgroundColor to lighter according to color prop', () => {
    render(<Divider color="lighter" />)
    const divider = screen.getByRole('separator')

    expect(divider).toHaveStyleRule('background-color', trimSpaces(lighter))
  })
  it('Sets topMargin to small according to variant prop', () => {
    render(<Divider variant="small" />)
    const divider = screen.getByRole('separator')

    expect(divider).toHaveStyleRule('margin-top', spacingSmall)
  })
  it('Can extend the css for the component', () => {
    render(<StyledDivider variant="small" />)
    const divider = screen.getByRole('separator')

    expect(divider).toHaveStyleRule('position', 'relative')
    expect(divider).toHaveStyleRule('margin-top', spacingSmall)
  })
})
