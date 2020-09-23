/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { topbar as tokens } from './TopBar.tokens'
import { TopBar } from '.'

const { Actions, Header, CustomContent } = TopBar

const StyledTopBar = styled(TopBar)`
  background: red;
`

const ScrollContainer = styled.div`
  height: 2000px;
  width: 500px;
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
      `${bottom.width} solid ${bottom.color.split(' ').join('')}`,
    )
    expect(topbar).toHaveStyleRule('height', height)
  })

  it('Has all provided content', () => {
    const testIdHeader = 'topbar-test-header'
    const testIdCenter = 'topbar-test-center'
    const testIdActions = 'topbar-test-actions'

    const { queryByTestId } = render(
      <TopBar>
        <Header>
          <button type="button" data-testid={testIdHeader}>
            Click me!
          </button>
        </Header>
        <CustomContent>
          <input type="text" data-testid={testIdCenter} />
        </CustomContent>
        <Actions>
          <p data-testid={testIdActions}>icon</p>
        </Actions>
      </TopBar>,
    )
    expect(queryByTestId(testIdHeader)).toBeDefined()
    expect(queryByTestId(testIdCenter)).toBeDefined()
    expect(queryByTestId(testIdActions)).toBeDefined()
  })

  it('Has provided title', () => {
    const title = 'Some application title'
    const { queryByText } = render(<TopBar title={title} />)
    expect(queryByText(title)).toBeDefined()
  })

  it('Has sticky position in container', () => {
    const testId = 'topbar-test'
    const { queryByTestId } = render(
      <ScrollContainer>
        <TopBar className="test-bar" data-testid={testId}>
          Content
        </TopBar>
      </ScrollContainer>,
    )

    // TODO Figure out how to check if TopBar fills container width
    expect(queryByTestId(testId)).toHaveStyleRule('position', 'sticky')
    expect(queryByTestId(testId)).toHaveStyleRule('top', '0')
  })

  it('Can extend the css for the component', () => {
    const { container } = render(<StyledTopBar />)
    const topbar = container.firstChild
    expect(topbar).toHaveStyleRule('background', 'red')
    expect(topbar).toHaveStyleRule('height', height)
  })
})
