import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { Typography } from '../Typography'
import * as tokens from './Card.tokens'
import { trimSpaces } from '../../utils'

import { Card } from '.'

const { Header, HeaderTitle, Media, Actions } = Card

const { info } = tokens

const StyledCard = styled(Card)`
  position: relative;
  height: 100px;
  width: 100px;
`
const StyledHeader = styled(Header)`
  position: relative;
  height: 100px;
  width: 100px;
`

const StyledHeaderTitle = styled(HeaderTitle)`
  position: relative;
  height: 100px;
  width: 100px;
`

const StyledMedia = styled(Media)`
  position: relative;
  height: 100px;
  width: 100px;
`

const StyledActions = styled(Actions)`
  position: relative;
  height: 100px;
  width: 100px;
`

afterEach(cleanup)

describe('Card', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(
      <Card>
        <Card.Media fullWidth>
          <img src="https://i.imgur.com/UM3mrju.jpg" alt="cat" />
        </Card.Media>
        <Card.Header>
          <Card.HeaderTitle>
            <Typography variant="h5">Another interactive example</Typography>
            <Typography variant="body_short">
              Unfortunately you cannot control children in storybook yet
            </Typography>
          </Card.HeaderTitle>
        </Card.Header>
        <Typography variant="body_short">
          Leading images are full width, and go straight to the top - ignoring
          spacings
        </Typography>
      </Card>,
    )
    expect(asFragment()).toMatchSnapshot()
  })
  it('Has correct color', () => {
    const { container } = render(<Card variant="info" />)
    const card = container.firstChild
    expect(card).toHaveStyleRule(
      'background-color',
      trimSpaces(info.background),
    )
  })
  it('Has provided title and subtitle in CardHeaderTitle', () => {
    const title = 'Title'
    const subtitle = 'subtitle'
    const { queryByText } = render(
      <Card>
        <Header>
          <Typography variant="h4">{title}</Typography>
          <Typography variant="body_short">{subtitle}</Typography>
        </Header>
      </Card>,
    )

    expect(queryByText(title)).toBeDefined()
    expect(queryByText(subtitle)).toBeDefined()
  })
  it('Has provided image source and placement in Media', () => {
    const fullWidth = 'fullWidth'
    const src = 'https://i.imgur.com/UM3mrju.jpg'
    const { queryByText } = render(
      <Card>
        <Media fullWidth>
          <img src={src} alt="alt" />
        </Media>
      </Card>,
    )

    expect(queryByText(fullWidth)).toBeDefined()
    expect(queryByText(src)).toBeDefined()
  })
  it('CardActions items are placed correctly', () => {
    const { container } = render(
      <Card>
        <Actions alignRight>
          <button type="button">Click me!</button>
        </Actions>
      </Card>,
    )
    const child = container.firstChild
    expect(child.firstChild).toHaveStyleRule('justify-content', 'flex-end')
  })
  it('Can extend the css for the Card Component', () => {
    const { container } = render(<StyledCard />)
    const card = container.firstChild
    expect(card).toHaveStyleRule('position', 'relative')
    expect(card).toHaveStyleRule('height', '100px')
    expect(card).toHaveStyleRule('width', '100px')
  })
  it('Can extend the css for the Header Component', () => {
    const { container } = render(<StyledHeader />)
    const cardHeader = container.firstChild
    expect(cardHeader).toHaveStyleRule('position', 'relative')
    expect(cardHeader).toHaveStyleRule('height', '100px')
    expect(cardHeader).toHaveStyleRule('width', '100px')
  })
  it('Can extend the css for the HeaderTitle Component', () => {
    const { container } = render(<StyledHeaderTitle />)
    const cardHeaderTitle = container.firstChild
    expect(cardHeaderTitle).toHaveStyleRule('position', 'relative')
    expect(cardHeaderTitle).toHaveStyleRule('height', '100px')
    expect(cardHeaderTitle).toHaveStyleRule('width', '100px')
  })
  it('Can extend the css for the Media Component', () => {
    const { container } = render(<StyledMedia />)
    const cardMedia = container.firstChild
    expect(cardMedia).toHaveStyleRule('position', 'relative')
    expect(cardMedia).toHaveStyleRule('height', '100px')
    expect(cardMedia).toHaveStyleRule('width', '100px')
  })
  it('Can extend the css for the Actions Component', () => {
    const { container } = render(<StyledActions />)
    const cardActions = container.firstChild
    expect(cardActions).toHaveStyleRule('position', 'relative')
    expect(cardActions).toHaveStyleRule('height', '100px')
    expect(cardActions).toHaveStyleRule('width', '100px')
  })
})
