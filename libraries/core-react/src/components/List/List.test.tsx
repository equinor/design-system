/* eslint-disable no-undef */
import { render, cleanup, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { List } from '.'

afterEach(cleanup)

const StyledList = styled(List)`
  margin-left: 0;
`

describe('Lists', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(
      <List>
        <List.Item>Item 1</List.Item>
        <List.Item>Item 2</List.Item>
      </List>,
    )
    expect(asFragment()).toMatchSnapshot()
  })
  it('Renders an unordered list by default', () => {
    const { container } = render(
      <List>
        <List.Item>Item 1</List.Item>
      </List>,
    )
    expect(screen.queryByText('Item 1')).toBeInTheDocument()
    expect(container.querySelector('ul')).toBeInTheDocument()
  })
  it('Renders an unordered list with variant bullet', () => {
    const { container } = render(
      <List variant="bullet">
        <List.Item>Item 1</List.Item>
      </List>,
    )
    expect(screen.queryByText('Item 1')).toBeInTheDocument()
    expect(container.querySelector('ul')).toBeInTheDocument()
  })
  it('Renders an ordered list with variant numbered', () => {
    const { container } = render(
      <List variant="numbered">
        <List.Item>Item 1</List.Item>
      </List>,
    )
    expect(screen.queryByText('Item 1')).toBeInTheDocument()
    expect(container.querySelector('ol')).toBeInTheDocument()
  })
  it('Can extend the css for the component', () => {
    const { container } = render(
      <StyledList>
        <List.Item>Item 1</List.Item>
      </StyledList>,
    )
    expect(container.firstChild).toHaveStyleRule('margin-left', '0')
  })
  it('Has start attribute if list variant is numbered', () => {
    const { container } = render(
      <List variant="numbered" start="10">
        <List.Item>Item 1</List.Item>
        <List.Item>Item 2</List.Item>
      </List>,
    )
    expect(container.querySelector('ol')).toBeInTheDocument()
    expect(container.firstChild).toHaveAttribute('start')
  })
})
