/* eslint-disable no-undef */
import { render, cleanup, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import { axe } from 'jest-axe'
import styled from 'styled-components'
import { TableOfContents } from '.'

const { LinkItem } = TableOfContents

const StyledTableOfContents = styled(TableOfContents)`
  background: red;
`

const ScrollContainer = styled.div`
  height: 2000px;
  width: 500px;
`

afterEach(cleanup)

describe('TableOfContents', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(
      <TableOfContents>
        <LinkItem>Anchor</LinkItem>
      </TableOfContents>,
    )

    expect(asFragment()).toMatchSnapshot()
  })
  it('Should pass a11y test', async () => {
    const { container } = render(<TableOfContents />)
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Should pass a11y test with link', async () => {
    const { container } = render(
      <TableOfContents>
        <LinkItem>Anchor</LinkItem>
      </TableOfContents>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Can extend the css for the component', () => {
    render(<StyledTableOfContents>Stuff</StyledTableOfContents>)
    const toc = screen.getByRole('navigation')
    expect(toc).toHaveStyleRule('background', 'red')
  })

  it('Can have fixed position in container', () => {
    const testId = 'toc-test'
    render(
      <ScrollContainer>
        <TableOfContents data-testid={testId} sticky>
          Content
        </TableOfContents>
      </ScrollContainer>,
    )

    expect(screen.queryByTestId(testId)).toHaveStyleRule('position', 'fixed')
    expect(screen.queryByTestId(testId)).toHaveStyleRule('top', '32px')
    expect(screen.queryByTestId(testId)).toHaveStyleRule('right', '32px')
  })

  it('Has provided label', () => {
    const label = 'Some toc label'
    render(
      <TableOfContents label={label}>
        <LinkItem>Anchor</LinkItem>
      </TableOfContents>,
    )
    expect(screen.getByText(label)).toBeDefined()
  })

  it('Has all provided content', () => {
    const testIdItem = 'toc-test-linkitem'

    render(
      <TableOfContents>
        <LinkItem data-testid={testIdItem}>
          <p>TestItem</p>
        </LinkItem>
      </TableOfContents>,
    )
    expect(screen.getByTestId(testIdItem)).toBeDefined()
  })
})
