/* eslint-disable no-undef */
import * as React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { popover as tokens } from './Popover.tokens'
import { Popover } from '.'
import { Button } from '../Button'
import { Typography } from '../Typography'
import type { PopoverProps } from './Popover'

const { PopoverTitle, PopoverContent, PopoverAnchor } = Popover

const StyledPopover = styled(Popover)`
  position: absolute;
  width: 100px;
`

const {
  placement: { topRight },
} = tokens

afterEach(cleanup)

const SimplePopover = ({
  open = false,
  placement = 'bottom',
}: PopoverProps) => (
  <Popover open={open} placement={placement}>
    <PopoverAnchor>
      <Button onClick={(e) => e.stopPropagation()}>On Click</Button>
    </PopoverAnchor>
    <PopoverTitle>Title</PopoverTitle>
    <PopoverContent>
      <Typography>Content</Typography>
    </PopoverContent>
  </Popover>
)

describe('Popover', () => {
  it('Popover has correct placement', () => {
    const { container } = render(<SimplePopover open placement="topRight" />)
    const popoverWrapper = container.lastElementChild
    const popover = popoverWrapper.lastChild
    expect(popoverWrapper).toHaveStyleRule('display', 'inline-flex')
    expect(popover).toHaveStyleRule('top', `${topRight.popoverTop}`)
    expect(popover).toHaveStyleRule('right', `${topRight.popoverRight}`)
  })
  it('Arrow has correct placement', () => {
    const { container } = render(<SimplePopover open placement="topRight" />)
    const arrow = container.lastElementChild.lastChild.firstChild.firstChild
    expect(arrow).toHaveStyleRule('right', `${topRight.arrowRight}`)
    expect(arrow).toHaveStyleRule('bottom', `${topRight.arrowBottom}`)
  })
  it('Has provided necessary PopoverProps', () => {
    const placement = 'topRight'
    const { queryByText } = render(<SimplePopover open placement={placement} />)
    expect(queryByText(placement)).toBeDefined()
  })
  it('Can extend the css for the component', () => {
    const { container } = render(
      <StyledPopover open placement="topRight">
        <PopoverAnchor>
          <Button onClick={(e) => e.stopPropagation()}>On Click</Button>
        </PopoverAnchor>
        <PopoverTitle>Title</PopoverTitle>
        <PopoverContent>
          <Typography>Content</Typography>
        </PopoverContent>
      </StyledPopover>,
    )
    const popover = container.firstChild
    expect(popover).toHaveStyleRule('position', 'absolute')
    expect(popover).toHaveStyleRule('width', '100px')
  })
})
it("Doesn't crash if no children is provided to Popover component", () => {
  const placement = 'topLeft'
  const { queryByText } = render(<Popover placement={placement} />)
  expect(queryByText(placement)).toBeDefined()
})
it("Doesn't crash if Popover anchor is missing content", () => {
  const placement = 'topLeft'
  const { queryByText } = render(
    <Popover placement={placement}>
      <PopoverAnchor />
      <PopoverTitle>Title</PopoverTitle>
      <PopoverContent>Content</PopoverContent>
    </Popover>,
  )
  expect(queryByText(placement)).toBeDefined()
})
it("Doesn't crash if no children is provided to Popover content", () => {
  const placement = 'topLeft'
  const { queryByText } = render(
    <Popover placement={placement}>
      <PopoverAnchor>
        <Button onClick={(e) => e.stopPropagation()}>On Click</Button>
      </PopoverAnchor>
      <PopoverTitle>Title</PopoverTitle>
      <PopoverContent />
    </Popover>,
  )
  expect(queryByText(placement)).toBeDefined()
})
it("Doesn't crash if title is missing", () => {
  const placement = 'topLeft'
  const { queryByText } = render(
    <Popover placement={placement}>
      <PopoverAnchor>
        <Button onClick={(e) => e.stopPropagation()}>On Click</Button>
      </PopoverAnchor>
      <PopoverTitle />
      <PopoverContent>Content</PopoverContent>
    </Popover>,
  )
  expect(queryByText(placement)).toBeDefined()
})
