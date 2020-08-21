/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { Typography } from '..'

import { Card } from '.'

const { CardHeader, CardHeaderTitle, CardMedia, CardActions } = Card

const StyledCard = styled(Card)`
  position: relative;
  height: 100px;
  width: 100px;
`
const StyledCardHeader = styled(CardHeader)`
  position: relative;
  height: 100px;
  width: 100px;
`

const StyledCardHeaderTitle = styled(CardHeaderTitle)`
  position: relative;
  height: 100px;
  width: 100px;
`

const StyledCardMedia = styled(CardMedia)`
  position: relative;
  height: 100px;
  width: 100px;
`

const StyledCardActions = styled(CardActions)`
  position: relative;
  height: 100px;
  width: 100px;
`

afterEach(cleanup)

describe('Card', () => {
  it('Has correct color', () => {
    const { container } = render(<Card variant="info" />)
    const card = container.firstChild
    expect(card).toHaveStyleRule('background-color', 'rgba(213,234,244,1)')
  })
  it('Has provided title and subtitle in CardHeaderTitle', () => {
    const title = 'Title'
    const subtitle = 'subtitle'
    const { queryByText } = render(
      <Card>
        <CardHeader>
          <CardHeaderTitle>
            <Typography variant="h4">{title}</Typography>
            <Typography variant="body_short">{subtitle}</Typography>
          </CardHeaderTitle>
        </CardHeader>
      </Card>,
    )

    expect(queryByText(title)).toBeDefined()
    expect(queryByText(subtitle)).toBeDefined()
  })
  it('Has provided image source and placement in CardMedia', () => {
    const fullWidth = 'fullWidth'
    const src = 'https://i.imgur.com/UM3mrju.jpg'
    const { queryByText } = render(
      <Card>
        <CardMedia fullWidth>
          <img src={src} alt="alt" />
        </CardMedia>
      </Card>,
    )

    expect(queryByText(fullWidth)).toBeDefined()
    expect(queryByText(src)).toBeDefined()
  })
  it('CardActions items are placed correctly', () => {
    const { container } = render(
      <Card>
        <CardActions alignRight>
          <button type="button">Click me!</button>
        </CardActions>
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
  it('Can extend the css for the CardHeader Component', () => {
    const { container } = render(<StyledCardHeader />)
    const cardHeader = container.firstChild
    expect(cardHeader).toHaveStyleRule('position', 'relative')
    expect(cardHeader).toHaveStyleRule('height', '100px')
    expect(cardHeader).toHaveStyleRule('width', '100px')
  })
  it('Can extend the css for the CardHeaderTitle Component', () => {
    const { container } = render(<StyledCardHeaderTitle />)
    const cardHeaderTitle = container.firstChild
    expect(cardHeaderTitle).toHaveStyleRule('position', 'relative')
    expect(cardHeaderTitle).toHaveStyleRule('height', '100px')
    expect(cardHeaderTitle).toHaveStyleRule('width', '100px')
  })
  it('Can extend the css for the CardMedia Component', () => {
    const { container } = render(<StyledCardMedia />)
    const cardMedia = container.firstChild
    expect(cardMedia).toHaveStyleRule('position', 'relative')
    expect(cardMedia).toHaveStyleRule('height', '100px')
    expect(cardMedia).toHaveStyleRule('width', '100px')
  })
  it('Can extend the css for the CardActions Component', () => {
    const { container } = render(<StyledCardActions />)
    const cardActions = container.firstChild
    expect(cardActions).toHaveStyleRule('position', 'relative')
    expect(cardActions).toHaveStyleRule('height', '100px')
    expect(cardActions).toHaveStyleRule('width', '100px')
  })
})
