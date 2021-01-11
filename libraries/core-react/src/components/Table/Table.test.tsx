/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import { Table } from '.'
import styled from 'styled-components'
import { token as dataCellToken } from './Cell/DataCell.tokens'
import { token as headerCellToken } from './Cell/HeaderCell.tokens'

const { Caption, Cell, Head, Row, Body } = Table

const trim = (x: string): string => x.replace(/ /g, '')

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

    const headerCell = getByText(text).parentElement
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
    const cellBackground = trim(headerCellToken.background)
    const cellBorderBottom =
      headerCellToken.border.type === 'bordergroup'
        ? `${headerCellToken.border.bottom.width} ${
            headerCellToken.border.bottom.style
          } ${trim(headerCellToken.border.bottom.color)}`
        : ''

    expect(headElement).toHaveStyleRule('background', cellBackground)
    expect(headElement).toHaveStyleRule('border-bottom', cellBorderBottom)
    expect(regularContent).not.toHaveStyleRule('background', cellBackground)
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

    const trimmedFontFeature = dataCellToken.variants.numeric.typography.fontFeature.replace(
      /\s*,\s*/g,
      ',',
    )
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

  it('Has correct color on active row', () => {
    render(
      <Table>
        <Body>
          <Row active data-testid="row">
            <Cell>active</Cell>
          </Row>
        </Body>
      </Table>,
    )

    const row = screen.getByTestId('row')
    expect(row).toHaveStyleRule(
      'background',
      trim(dataCellToken.states.active.background),
    )
  })
  it('Has correct color on error cell even when active', () => {
    render(
      <Table>
        <Body>
          <Row active>
            <Cell color="error">error</Cell>
          </Row>
        </Body>
      </Table>,
    )

    const cell = screen.getByText('error')
    expect(cell).toHaveStyleRule(
      'background',
      trim(dataCellToken.validation.error.background),
    )
  })
  it('Has comfortable as default density', () => {
    const cellText = 'Header content'
    const headerText = 'Cell content'
    const { getByText } = render(
      <Table>
        <Head>
          <Row>
            <Cell as="th">{headerText}</Cell>
          </Row>
        </Head>
        <Body>
          <Row>
            <Cell>{cellText}</Cell>
          </Row>
        </Body>
      </Table>,
    )

    expect(getByText(headerText).parentElement).toHaveStyleRule(
      'height',
      headerCellToken.height,
    )
    expect(getByText(cellText)).toHaveStyleRule('height', dataCellToken.height)
  })
  it('Has compact density', () => {
    const cellText = 'Header content'
    const headerText = 'Cell content'
    const { getByText } = render(
      <Table density="compact">
        <Head>
          <Row>
            <Cell as="th">{headerText}</Cell>
          </Row>
        </Head>
        <Body>
          <Row>
            <Cell>{cellText}</Cell>
          </Row>
        </Body>
      </Table>,
    )

    expect(getByText(headerText).parentElement).toHaveStyleRule(
      'height',
      headerCellToken.density.compact.height,
    )
    expect(getByText(cellText)).toHaveStyleRule(
      'height',
      dataCellToken.density.compact.height,
    )
  })
  it('Has aria-sort when sort is provided', () => {
    const headerText = 'Cell content'
    const { getByText } = render(
      <Table>
        <Head>
          <Row>
            <Cell as="th" sort="ascending">
              {headerText}
            </Cell>
          </Row>
        </Head>
      </Table>,
    )
    const headerCell = getByText(headerText).parentElement
    expect(headerCell).toHaveAttribute('aria-sort', 'ascending')
  })
  it('Has active styling when sort is ascending or descending', () => {
    const headerText1 = 'Cell content'
    const headerText2 = 'Cell content 2'
    const { getByText } = render(
      <Table>
        <Head>
          <Row>
            <Cell as="th" sort="ascending">
              {headerText1}
            </Cell>
            <Cell as="th" sort="descending">
              {headerText2}
            </Cell>
          </Row>
        </Head>
      </Table>,
    )

    const borderBottomColor = trim(
      headerCellToken.states.active.border.type === 'bordergroup'
        ? headerCellToken.states.active.border.bottom.color
        : '',
    )
    const headerCell1 = getByText(headerText1).parentElement
    const headerCell2 = getByText(headerText2).parentElement

    expect(headerCell1).toHaveAttribute('aria-sort', 'ascending')
    expect(headerCell2).toHaveAttribute('aria-sort', 'descending')

    expect(headerCell1).toHaveStyleRule(
      'background',
      trim(headerCellToken.states.active.background),
    )
    expect(headerCell1).toHaveStyleRule(
      'color',
      trim(headerCellToken.states.active.typography.color),
    )
    expect(headerCell1).toHaveStyleRule('border-color', borderBottomColor)

    expect(headerCell2).toHaveStyleRule(
      'background',
      trim(headerCellToken.states.active.background),
    )
    expect(headerCell2).toHaveStyleRule(
      'color',
      trim(headerCellToken.states.active.typography.color),
    )
    expect(headerCell2).toHaveStyleRule('border-color', borderBottomColor)
  })
})
