/* eslint-disable no-undef */
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { progress as tokens } from './Progress.tokens'
import { CircularProgress, LinearProgress, StarProgress, DotProgress } from '.'
import { Icon, Button, Card, Typography } from '..'

const StyledProgress = styled(Progress)`
  position: absolute;
  width: 100px;
`

const {
  placement: { topRight },
} = tokens

afterEach(cleanup)

describe('Progress', () => {
  it('should render indeterminate as default', () => {
    // Not relevant for DotProgress
    const { circular } = render(<CircularProgress />)
    const { star } = render(<StarProgress />)
    const { linear } = render(<LinearProgress />)
    const popoverWrapper = container.lastElementChild
    const popover = popoverWrapper.lastChild
    expect(popoverWrapper).toHaveStyleRule('display', 'flex')
    expect(popover).toHaveStyleRule('top', `${topRight.popoverTop}`)
    expect(popover).toHaveStyleRule('right', `${topRight.popoverRight}`)
  })
  it('Arrow has correct placement', () => {
    const { container } = render(<SimplePopover open placement="topRight" />)
    const arrow = container.lastElementChild.lastChild.firstChild.firstChild
    expect(arrow).toHaveStyleRule('right', `${topRight.arrowRight}`)
    expect(arrow).toHaveStyleRule('bottom', `${topRight.arrowBottom}`)
  })
  it('Has provided necessary props', () => {
    const placement = 'topRight'
    const { queryByText } = render(<SimplePopover open placement={placement} />)
    expect(queryByText(placement)).toBeDefined()
  })
  it('Can extend the css for the component', () => {
    const { container } = render(
      <StyledProgress open placement="topRight">
        <PopoverAnchor>
          <Button onClick={(e) => e.stopPropagation()}>On Click</Button>
        </PopoverAnchor>
        <PopoverTitle>Title</PopoverTitle>
        <PopoverContent>
          <Typography>Content</Typography>
        </PopoverContent>
      </StyledProgress>,
    )
    const popover = container.firstChild
    expect(popover).toHaveStyleRule('position', 'absolute')
    expect(popover).toHaveStyleRule('width', '100px')
  })
})
