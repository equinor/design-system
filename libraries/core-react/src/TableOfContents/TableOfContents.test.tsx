/* eslint-disable no-undef */
import * as React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
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
  it('Can extend the css for the component', () => {
    const { container } = render(
      <StyledTableOfContents>Stuff</StyledTableOfContents>,
    )
    const toc = container.firstChild
    expect(toc).toHaveStyleRule('background', 'red')
  })

  it('Can have fixed position in container', () => {
    const testId = 'toc-test'
    const { queryByTestId } = render(
      <ScrollContainer>
        <TableOfContents data-testid={testId} sticky>
          Content
        </TableOfContents>
      </ScrollContainer>,
    )

    expect(queryByTestId(testId)).toHaveStyleRule('position', 'fixed')
    expect(queryByTestId(testId)).toHaveStyleRule('top', '32px')
    expect(queryByTestId(testId)).toHaveStyleRule('right', '32px')
  })

  it('Has provided label', () => {
    const label = 'Some toc label'
    const { queryByText } = render(
      <TableOfContents label={label}>
        <LinkItem>Anchor</LinkItem>
      </TableOfContents>,
    )
    expect(queryByText(label)).toBeDefined()
  })

  it('Has all provided content', () => {
    const testIdItem = 'toc-test-linkitem'

    const { queryByTestId } = render(
      <TableOfContents>
        <LinkItem data-testid={testIdItem}>
          <p>TestItem</p>
        </LinkItem>
      </TableOfContents>,
    )
    expect(queryByTestId(testIdItem)).toBeDefined()
  })
})
