/* eslint-disable no-undef */
import { render, cleanup, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { List } from '.'

const { ListItem } = List

afterEach(cleanup)

const StyledList = styled(List)`
  margin-left: 0;
`

describe('Lists', () => {
  it('Renders an unordered list by default', () => {
    const { container } = render(
      <List>
        <ListItem>Item 1</ListItem>
      </List>,
    )
    expect(screen.queryByText('Item 1')).toBeInTheDocument()
    expect(container.querySelector('ul')).toBeInTheDocument()
  })
  it('Renders an unordered list with variant bullet', () => {
    const { container } = render(
      <List variant="bullet">
        <ListItem>Item 1</ListItem>
      </List>,
    )
    expect(screen.queryByText('Item 1')).toBeInTheDocument()
    expect(container.querySelector('ul')).toBeInTheDocument()
  })
  it('Renders an ordered list with variant numbered', () => {
    const { container } = render(
      <List variant="numbered">
        <ListItem>Item 1</ListItem>
      </List>,
    )
    expect(screen.queryByText('Item 1')).toBeInTheDocument()
    expect(container.querySelector('ol')).toBeInTheDocument()
  })
  it('Can extend the css for the component', () => {
    const { container } = render(
      <StyledList>
        <ListItem>Item 1</ListItem>
      </StyledList>,
    )
    expect(container.firstChild).toHaveStyleRule('margin-left', '0')
  })
  it('Has start attribute if list variant is numbered', () => {
    const { container } = render(
      <List variant="numbered" start="10">
        <ListItem>Item 1</ListItem>
        <ListItem>Item 2</ListItem>
      </List>,
    )
    expect(container.querySelector('ol')).toBeInTheDocument()
    expect(container.firstChild).toHaveAttribute('start')
  })
})
