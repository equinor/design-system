/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { Popover } from '.'
import { popover as tokens } from './Popover.tokens'

const StyledPopover = styled(Popover)`
  position: relative;
  height: 100px;
  width: 100px;
`

const {
  placement: { topRight },
} = tokens

afterEach(cleanup)

describe('Popover', () => {
  it('Popover has correct placement', () => {
    const { container } = render(<Popover placement="topRight">Anchor</Popover>)
    const popoverWrapper = container.lastElementChild
    const popover = popoverWrapper.lastChild
    expect(popoverWrapper).toHaveStyleRule('display', 'flex')
    expect(popover).toHaveStyleRule('top', `${topRight.popoverTop}`)
    expect(popover).toHaveStyleRule('right', `${topRight.popoverRight}`)
  })
  it('Arrow has correct placement', () => {
    const { container } = render(<Popover placement="topRight">Anchor</Popover>)
    const arrow = container.lastElementChild.lastChild.firstChild.firstChild
    expect(arrow).toHaveStyleRule('right', `${topRight.arrowRight}`)
    expect(arrow).toHaveStyleRule('bottom', `${topRight.arrowBottom}`)
  })
  it('Has provided necessary props', () => {
    const title = 'Title'
    const variant = 'large'
    const anchor = 'Anchor'
    const { queryByText } = render(
      <Popover variant={variant} title={title}>
        {anchor}
      </Popover>,
    )
    expect(queryByText(title)).toBeDefined()
    expect(queryByText(variant)).toBeDefined()
    expect(queryByText(anchor)).toBeDefined()
  })
  it('Can extend the css for the component', () => {
    const { container } = render(<StyledPopover>Anchor</StyledPopover>)
    const popover = container.firstChild
    expect(popover).toHaveStyleRule('position', 'relative')
    expect(popover).toHaveStyleRule('height', '100px')
    expect(popover).toHaveStyleRule('width', '100px')
  })
})
