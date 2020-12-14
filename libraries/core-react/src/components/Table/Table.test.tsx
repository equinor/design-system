/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import { Table } from '.'
import styled from 'styled-components'
import { token } from './Cell/DataCell.tokens'

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
  it('Prints the caption', () => {
    const text = "I'm da caption"
    const { getByText } = render(
      <Table>
        <Head>
          <Row>
            <Cell as="th">{text}</Cell>
          </Row>
        </Head>
      </Table>,
    )
    expect(getByText(text)).toBeDefined()
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
  it('Can render a cell as a header cell', () => {
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

  it('Renders the header row visually different than the other rows by using a background colour', () => {
    const header = 'Header'
    const body = 'Body content'
    const { getByText } = render(
      <Table>
        <Head>
          <Row>
            <Cell as="th">{header}</Cell>
          </Row>
        </Head>
        <Body>
          <Row>
            <Cell>{body}</Cell>
          </Row>
        </Body>
      </Table>,
    )
    const headElement = getByText(header).closest('thead')
    const regularContent = getByText(body)
    const cellBackground = token.background.replace(/ /g, '')

    expect(headElement).not.toHaveStyleRule('background', cellBackground)
    expect(headElement).toHaveStyleRule(
      'border-bottom',
      '2px solid rgba(220,220,220,1)',
    )
    expect(regularContent).toHaveStyleRule('background', cellBackground)
  })

  it('Adjusts font for better readability if the text is a number', () => {
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
    const typography = {
      ...token.typography,
      ...token.variants.numeric.typography,
    }
    const trimmedFontFeature = typography.fontFeature.replace(/\s*,\s*/g, ',')
    expect(getByText(text)).toHaveStyleRule(
      'font-feature-settings',
      trimmedFontFeature,
    )
  })

  const StyledTable = styled(Table)`
    clip-path: unset;
  `

  it('Can extend the css for the component', () => {
    const { container } = render(<StyledTable />)
    expect(container.firstChild).toHaveStyleRule('clip-path', 'unset')
  })
})
