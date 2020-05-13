/* eslint-disable no-undef */
import React from 'react'
import PropTypes from 'prop-types'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { popover as tokens } from './Popover.tokens'
import { Popover } from '.'
import { Icon, Button, Card, Typography } from '..'

const {
  PopoverTitle,
  PopoverContent,
  PopoverAnchor,
  PopoverItem,
} = Popover

const {
  CardActions
} = Card

const StyledPopover = styled(Popover)`
  position: relative;
  height: 100px;
  width: 100px;
`

const {
  placement: { topRight },
} = tokens

afterEach(cleanup)

const SimplePopover = ({ open, placement }) => (
        <Popover open={open} placement={placement}>
          <PopoverAnchor>
            <Button onClick={(e) => e.stopPropagation()}>
              On Click
            </Button>
          </PopoverAnchor>
          <PopoverTitle>Title</PopoverTitle>
          <PopoverContent>
            <Typography>Content</Typography>
          </PopoverContent>
        </Popover>
)

const PopoverWithActions = () => (
  <Popover open>
    <PopoverAnchor>
      <Button onClick={(e) => e.stopPropagation()}>
        On Click
      </Button>
    </PopoverAnchor>
    <PopoverTitle>Title</PopoverTitle>
    <PopoverContent>
      <Typography>Content</Typography>
    </PopoverContent>
    <CardActions>
      <Button onClick={(e) => e.stopPropagation()}>Cancel</Button>
      <Button onClick={(e) => e.stopPropagation()}>OK</Button>
    </CardActions>
  </Popover>
)

SimplePopover.propTypes = {
  open: PropTypes.bool,
  placement: PropTypes.string,
}

SimplePopover.defaultProps = {
  open: false,
  chevronPosition: 'bottom',
}
 
describe('Popover', () => {
  it('Opens based on prop', () => {
    render(<SimplePopover />)
    const 
  })
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
