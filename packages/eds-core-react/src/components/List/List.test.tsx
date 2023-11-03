/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import styled from 'styled-components'
import { List } from '.'

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
  it('Should pass a11y test', async () => {
    const { container } = render(
      <List>
        <List.Item>Item 1</List.Item>
        <List.Item>Item 2</List.Item>
      </List>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Should pass a11y test with variant', async () => {
    const { container } = render(
      <List variant="bullet">
        <List.Item>Item 1</List.Item>
        <List.Item>Item 2</List.Item>
      </List>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Renders an unordered list by default', () => {
    render(
      <List>
        <List.Item>Item 1</List.Item>
      </List>,
    )
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByRole('list').nodeName).toEqual('UL')
  })
  it('Renders an unordered list with variant bullet', () => {
    render(
      <List variant="bullet">
        <List.Item>Item 1</List.Item>
      </List>,
    )
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByRole('list').nodeName).toEqual('UL')
  })
  it('Renders an ordered list with variant numbered', () => {
    render(
      <List variant="numbered">
        <List.Item>Item 1</List.Item>
      </List>,
    )
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByRole('list').nodeName).toEqual('OL')
  })
  it('Can extend the css for the component', () => {
    render(
      <StyledList>
        <List.Item>Item 1</List.Item>
      </StyledList>,
    )
    expect(screen.getByRole('list')).toHaveStyleRule('margin-left', '0')
  })
  it('Has start attribute if list variant is numbered', () => {
    render(
      <List variant="numbered" start="10">
        <List.Item>Item 1</List.Item>
        <List.Item>Item 2</List.Item>
      </List>,
    )
    expect(screen.getByRole('list').nodeName).toEqual('OL')
    expect(screen.getByRole('list')).toHaveAttribute('start')
  })
})
