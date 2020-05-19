/* eslint-disable no-undef */
import React  from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { render, cleanup } from '@testing-library/react'
//import Adapter from 'enzyme-adapter-react-16';
//import { mount, configure } from 'enzyme';
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
  PopoverItem
} = Popover

const {
  CardActions
} = Card

const StyledPopover = styled(Popover)`
  position: absolute;
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

//configure({adapter: new Adapter()});
 
describe('Popover', () => {
  it('Popover has correct placement', () => {
    const { container } = render(<SimplePopover open placement="topRight"/>)
    const popoverWrapper = container.lastElementChild
    const popover = popoverWrapper.lastChild
    expect(popoverWrapper).toHaveStyleRule('display', 'flex')
    expect(popover).toHaveStyleRule('top', `${topRight.popoverTop}`)
    expect(popover).toHaveStyleRule('right', `${topRight.popoverRight}`)
  })
  it('Arrow has correct placement', () => {
    const { container } = render(<SimplePopover open placement="topRight"/>)
    const arrow = container.lastElementChild.lastChild.firstChild.firstChild
    expect(arrow).toHaveStyleRule('right', `${topRight.arrowRight}`)
    expect(arrow).toHaveStyleRule('bottom', `${topRight.arrowBottom}`)
  })
  it('Has provided necessary props', () => {
    const placement = "topRight"
    const { queryByText } = render(
      <SimplePopover open placement={placement}/>,
    )
    expect(queryByText(placement)).toBeDefined()
  })
  it('Can extend the css for the component', () => {
    const { container } = render(
    <StyledPopover open placement="topRight">
      <PopoverAnchor>
        <Button onClick={(e) => e.stopPropagation()}>
          On Click
        </Button>
      </PopoverAnchor>
      <PopoverTitle>Title</PopoverTitle>
      <PopoverContent>
        <Typography>Content</Typography>
      </PopoverContent>
    </StyledPopover>)
    const popover = container.firstChild
    expect(popover).toHaveStyleRule('position', 'absolute')
    // expect(popover).toHaveStyleRule('height', '100px')
    expect(popover).toHaveStyleRule('width', '100px')
  })
})
