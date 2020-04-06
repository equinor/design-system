/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'

import { Card } from '.'

const { CardTitle, CardMedia, CardText, CardActions } = Card

const StyledCard = styled(Card)`
  position: relative;
  height: 100px;
  width: 100px;
`

afterEach(cleanup)

describe('Card', () => {
  it('Works', () => {
    const { card } = render(<Card />)

    expect(card).toMatchSnapshot()
  })
  it('Has correct color', () => {
    const { container } = render(<Card variant="info" />)
    const card = container.firstChild
    expect(card).toHaveStyleRule('background-color', 'rgba(213,234,244,1)')
  })
  it('Has provided title and subtitle in CardTitle', () => {
    const title = 'Title'
    const subtitle = 'subtitle'
    const { queryByText } = render(
      <Card>
        <CardTitle variant="h4" title={title} subtitle={subtitle} />
      </Card>,
    )

    expect(queryByText(title)).toBeDefined()
    expect(queryByText(subtitle)).toBeDefined()
  })
  it('Has provided text and variation in CardText', () => {
    const text = 'This is a text'
    const variant = 'isLastBlock'
    const { queryByText } = render(
      <Card>
        <CardText isLastBlock>{text}</CardText>
      </Card>,
    )

    expect(queryByText(text)).toBeDefined()
    expect(queryByText(variant)).toBeDefined()
  })
  it('Has provided image source and placement in CardMedia', () => {
    const order = 'leading'
    const src = 'https://i.imgur.com/UM3mrju.jpg'
    const { queryByText } = render(
      <Card>
        <CardMedia order={order}>
          <img src={src} alt="alt" />
        </CardMedia>
      </Card>,
    )

    expect(queryByText(order)).toBeDefined()
    expect(queryByText(src)).toBeDefined()
  })
  it('CardActions items are placed correctly', () => {
    const { container } = render(
      <Card>
        <CardActions alignRight>
          <button type="button" />
        </CardActions>
      </Card>,
    )
    const child = container.firstChild
    expect(child.firstChild).toHaveStyleRule('justify-content', 'flex-end')
  })
  it('CardMedia items are placed correctly', () => {
    const { container } = render(
      <Card>
        <CardMedia order="leading">
          <img src="https://i.imgur.com/UM3mrju.jpg" alt="alt" />
        </CardMedia>
      </Card>,
    )
    const child = container.firstChild
    expect(child.firstChild).toHaveStyleRule('margin-left', '-16px')
  })
  it('Can extend the css for the component', () => {
    const { container } = render(<StyledCard />)
    const card = container.firstChild
    expect(card).toHaveStyleRule('position', 'relative')
    expect(card).toHaveStyleRule('height', '100px')
    expect(card).toHaveStyleRule('width', '100px')
  })
})
