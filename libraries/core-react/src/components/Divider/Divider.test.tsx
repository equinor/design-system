/* eslint-disable no-undef */
import { render, cleanup } from '@testing-library/react'
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
  it('Has medium colour and medium spacing as default', () => {
    const { container } = render(<Divider />)
    expect(container.firstChild).toHaveStyleRule(
      'background-color',
      trimSpaces(mediumColor),
    )
    expect(container.firstChild).toHaveStyleRule('margin-top', spacingMedium)
  })
  it('Sets backgroundColor to light according to color prop', () => {
    const { container } = render(<Divider color="light" />)
    expect(container.firstChild).toHaveStyleRule(
      'background-color',
      trimSpaces(light),
    )
  })
  it('Sets backgroundColor to lighter according to color prop', () => {
    const { container } = render(<Divider color="lighter" />)
    expect(container.firstChild).toHaveStyleRule(
      'background-color',
      trimSpaces(lighter),
    )
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
