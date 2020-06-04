/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { Tooltip } from '.'
import { tooltip as tokens } from './Tooltip.tokens'

const StyledTooltip = styled(Tooltip)`
  position: relative;
  height: 100px;
  width: 100px;
`

const {
  placement: { topRight },
} = tokens

afterEach(cleanup)

describe('Tooltip', () => {
  it('Tooltip has correct placement', () => {
    const { container } = render(
      <Tooltip open placement="topRight">
        Anchor
      </Tooltip>,
    )
    const tooltipWrapper = container.firstChild
    const tooltip = screen.getByRole('tooltip')

    expect(tooltipWrapper).toHaveStyleRule('display', 'flex')
    expect(tooltip).toHaveStyleRule('top', `${topRight.tooltipTop}`)
    expect(tooltip).toHaveStyleRule('right', `${topRight.tooltipRight}`)
  })
  it('Arrow has correct placement', () => {
    const { container } = render(
      <Tooltip open placement="topRight">
        Anchor
      </Tooltip>,
    )
    const arrow = container.lastElementChild.lastChild.firstChild.firstChild
    expect(arrow).toHaveStyleRule('right', `${topRight.arrowRight}`)
    expect(arrow).toHaveStyleRule('bottom', `${topRight.arrowBottom}`)
  })
  it('Has provided necessary props', () => {
    const title = 'Title'
    const placement = 'topLeft'
    const anchor = 'Anchor'
    const { queryByText } = render(
      <Tooltip open placement={placement} title={title}>
        {anchor}
      </Tooltip>,
    )
    expect(queryByText(title)).toBeDefined()
    expect(queryByText(placement)).toBeDefined()
    expect(queryByText(anchor)).toBeDefined()
  })
  it('Can extend the css for the component', () => {
    const { container } = render(<StyledTooltip>Anchor</StyledTooltip>)
    const tooltip = container.firstChild
    expect(tooltip).toHaveStyleRule('position', 'relative')
    expect(tooltip).toHaveStyleRule('height', '100px')
    expect(tooltip).toHaveStyleRule('width', '100px')
  })
})
