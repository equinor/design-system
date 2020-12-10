/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import { Table } from '.'

const { Caption, Cell, Head, Row, Body } = Table

afterEach(cleanup)

describe('Caption', () => {
  it('Renders a table with caption element present in the document', () => {
    const { container } = render(
      <Table>
        <Caption>test</Caption>
      </Table>,
    )
    expect(container.querySelector('Caption')).toBeInTheDocument()
  })
  it('Renders a table with caption, and caption-side set default to top', () => {
    const { container } = render(
      <Table>
        <Caption>test</Caption>
      </Table>,
    )
    expect(container.querySelector('Caption')).toHaveStyleRule(
      'caption-side',
      'top',
    )
  })
  it('Renders a table with caption, and caption-side set to bottom', () => {
    const { container } = render(
      <Table>
        <Caption captionSide="bottom">test</Caption>
      </Table>,
    )
    expect(container.querySelector('Caption')).toHaveStyleRule(
      'caption-side',
      'bottom',
    )
  })
})

describe('Table', () => {
  it('Renders a cell as a header cell', () => {
    const text = 'Name'
    const { getByText, container } = render(
      <Table>
        <Head>
          <Row>
            <Cell as="th">{text}</Cell>
          </Row>
        </Head>
      </Table>,
    )

    const headerCell = getByText(text)
    const th = container.querySelector('th')
    expect(headerCell).toEqual(th)
  })

  it('Adjusts font if the text is a number', () => {
    const text = '369470'
    const { getByText } = render(
      <Table>
        <Body>
          <Row>
            <Cell variant="numeric">{text}</Cell>
          </Row>
        </Body>
      </Table>,
    )

    expect(getByText(369470)).toHaveStyleRule(
      'font-feature-settings',
      "'tnum' on,'lnum' on",
    )
  })
})
