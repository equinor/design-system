/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import { axe } from 'jest-axe'
import styled from 'styled-components'
import { topbar as topbarToken } from './TopBar.tokens'
import { TopBar } from '.'

const { Actions, Header, CustomContent } = TopBar

const StyledTopBar = styled(TopBar)`
  background: red;
`

const ScrollContainer = styled.div`
  height: 2000px;
  width: 500px;
`
const { height } = topbarToken

describe('TopBar', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(
      <TopBar>
        <Header>
          <button type="button">Click me!</button>
        </Header>
        <CustomContent>
          <input type="text" />
        </CustomContent>
        <Actions>
          <p>icon</p>
        </Actions>
      </TopBar>,
    )

    expect(asFragment()).toMatchSnapshot()
  })
  it('Should pass a11y test', async () => {
    const { container } = render(
      <TopBar>
        <Header>Header tex</Header>
        <CustomContent>Content text</CustomContent>
        <Actions>
          <p>Icon</p>
        </Actions>
      </TopBar>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Has correct height', () => {
    render(
      <TopBar data-testid="topbar">
        <Header>title</Header>
      </TopBar>,
    )
    const topbar = screen.getByTestId('topbar')

    expect(topbar).toHaveStyleRule('height', height)
  })

  it('Has all provided content', () => {
    const testIdHeader = 'topbar-test-header'
    const testIdCenter = 'topbar-test-center'
    const testIdActions = 'topbar-test-actions'

    render(
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
    expect(screen.getByTestId(testIdHeader)).toBeDefined()
    expect(screen.getByTestId(testIdCenter)).toBeDefined()
    expect(screen.getByTestId(testIdActions)).toBeDefined()
  })

  it('Has provided title', () => {
    const title = 'Some application title'
    render(<TopBar title={title} />)
    expect(screen.getByTitle(title)).toBeDefined()
  })

  it('Has sticky position in container', () => {
    const testId = 'topbar-test'
    render(
      <ScrollContainer>
        <TopBar className="test-bar" data-testid={testId}>
          Content
        </TopBar>
      </ScrollContainer>,
    )

    expect(screen.queryByTestId(testId)).toHaveStyleRule('position', 'sticky')
    expect(screen.queryByTestId(testId)).toHaveStyleRule('top', '0')
  })

  it('Can extend the css for the component', () => {
    render(<StyledTopBar data-testid="topbar"></StyledTopBar>)
    const topbar = screen.getByTestId('topbar')

    expect(topbar).toHaveStyleRule('background', 'red')
    expect(topbar).toHaveStyleRule('height', height)
  })
})
