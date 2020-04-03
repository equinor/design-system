/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { Button, Icon } from '@equinor/eds-core-react'
import { more_verticle, share, person_add, settings } from '@equinor/eds-icons'

import { Card } from '.'

const icons = {
  more_verticle,
  share,
  person_add,
  settings,
}

Icon.add(icons)
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
    expect(card).toHaveStyleRule('background-color', '#d5eaf4')
  })
  it('Has all provided content', () => {
    // const testIdTitle = 'card-title-test'
    // const testIdMedia = 'card-media-test'
    // const testIdText = 'card-text-test'
    const testIdActions = 'card-actions-test'

    const { queryByTestId } = render(
      <Card>
        <CardTitle
          variant="h6"
          title="Title"
          subtitle="Caption"
          avatar="https://i.imgur.com/UM3mrju.jpg"
        />
        <CardText>Action elements are aligned left in this example</CardText>
        <CardMedia order="middle">
          <img src="https://i.imgur.com/UM3mrju.jpg" alt="For representation" />
        </CardMedia>
        <CardActions>
          <Button>Cancel</Button>
          <Button>OK</Button>
        </CardActions>
      </Card>,
    )
    expect(queryByTestId(testIdHeader)).toBeDefined()
    expect(queryByTestId(testIdCenter)).toBeDefined()
    expect(queryByTestId(testIdActions)).toBeDefined()
  })
  it('Can extend the css for the component', () => {
    const { container } = render(<StyledCard />)
    const card = container.firstChild
    expect(card).toHaveStyleRule('position', 'relative')
    expect(card).toHaveStyleRule('height', '100px')
    expect(card).toHaveStyleRule('width', '100px')
  })
})
