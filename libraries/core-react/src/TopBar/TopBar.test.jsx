/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { topbar as tokens } from './TopBar.tokens'
import { TopBar } from '.'

const StyledTopBar = styled(TopBar)`
  background: red;
`
const {
  height,
  border: { bottom },
} = tokens

afterEach(cleanup)

describe('TopBar', () => {
  it('Has correct height', () => {
    const title = 'Some application title'
    const { container } = render(<TopBar title={title} />)
    const topbar = container.firstChild
    expect(topbar).toHaveStyleRule(
      'border-bottom',
      `${bottom.width} solid ${bottom.color}`,
    )
    expect(topbar).toHaveStyleRule('height', height)
  })

  it('Has all provided content', () => {
    const testIdLeft = 'topbar-test-left'
    const testIdCenter = 'topbar-test-center'
    const testIdRight = 'topbar-test-right'

    const left = <button type="button" data-testid={testIdLeft} />
    const center = <input type="text" data-testid={testIdCenter} />
    const right = <p data-testid={testIdRight}>icon</p>

    const { queryByTestId } = render(
      <TopBar left={left} center={center} right={right} />,
    )
    expect(queryByTestId(testIdLeft)).toBeDefined()
    expect(queryByTestId(testIdCenter)).toBeDefined()
    expect(queryByTestId(testIdRight)).toBeDefined()
  })

  it('Has provided title', () => {
    const title = 'Some application title'
    const { queryByText } = render(<TopBar title={title} />)
    expect(queryByText(title)).toBeDefined()
  })

  it('Has gutter when position is fixed', () => {
    const { container } = render(<TopBar />)
    const topbar = container.firstChild
    const gutter = container.children[1]
    expect(topbar).toHaveStyleRule('position', 'fixed')
    expect(gutter).toHaveStyleRule('height', height)
  })

  it('Can extend the css for the component', () => {
    const { container } = render(<StyledTopBar />)
    const topbar = container.firstChild
    expect(topbar).toHaveStyleRule('background', 'red')
    expect(topbar).toHaveStyleRule('height', height)
  })
})
