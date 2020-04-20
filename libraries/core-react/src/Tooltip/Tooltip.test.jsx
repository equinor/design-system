/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { Tooltip } from '.'

const StyledTooltip = styled(Tooltip)`
  position: relative;
  height: 100px;
  width: 100px;
`

afterEach(cleanup)

describe('Tooltip', () => {
  it('Has correct placement', () => {
    const { container } = render(<Tooltip placement="top">Anchor</Tooltip>)
    const tooltip = container.firstChild
    expect(tooltip).toHaveStyleRule('top', '-40px')
  })
  it('Has provided necessary props', () => {
    const title = 'Title'
    const variant = 'large'
    const { queryByText } = render(<Tooltip variant={variant} title={title} />)
    expect(queryByText(title)).toBeDefined()
    expect(queryByText(variant)).toBeDefined()
  })
  it('Can extend the css for the component', () => {
    const { container } = render(<StyledTooltip />)
    const tooltip = container.firstChild
    expect(tooltip).toHaveStyleRule('position', 'relative')
    expect(tooltip).toHaveStyleRule('height', '100px')
    expect(tooltip).toHaveStyleRule('width', '100px')
  })
})
