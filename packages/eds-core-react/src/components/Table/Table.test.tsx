/* eslint-disable no-undef */
import { render, cleanup, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import { Table } from '.'
import styled from 'styled-components'
import { tableCell as dataCellToken } from './DataCell/DataCell.tokens'
import { token as headerCellToken } from './HeaderCell/HeaderCell.tokens'
import { EdsProvider } from '../EdsProvider'

const { Caption, Cell, Head, Row, Body } = Table

const trim = (x: string): string => x.replace(/ /g, '')

afterEach(cleanup)

describe('Caption', () => {
  it('Renders a caption with provided text', () => {
    const text = "I'm da caption"
    render(
      <Table>
        <Head>
          <Row>
            <Cell>{text}</Cell>
          </Row>
        </Head>
      </Table>,
    )
    expect(screen.getByText(text)).toBeDefined()
  })
  it('Renders a table with caption, and caption-side set default to top', () => {
    render(
      <Table>
        <Caption>test</Caption>
      </Table>,
    )
    expect(screen.getByText('test')).toHaveStyleRule('caption-side', 'top')
  })
  it('Renders a table with caption, and caption-side set to bottom', () => {
    render(
      <Table>
        <Caption captionSide="bottom">test</Caption>
      </Table>,
    )
    expect(screen.getByText('test')).toHaveStyleRule('caption-side', 'bottom')
  })
})

describe('Table', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(
      <Table>
        <Head>
          <Row>
            <Cell></Cell>
          </Row>
        </Head>
      </Table>,
    )

    expect(asFragment).toMatchSnapshot()
  })
  it('Can render a cell as a header cell', () => {
    const text = 'Name'
    render(
      <Table>
        <Head>
          <Row>
            <Cell data-testid="headercell">{text}</Cell>
          </Row>
        </Head>
      </Table>,
    )

    const th = screen.getByTestId('headercell')
    expect(th.nodeName).toEqual('TH')
  })

  it('Renders the header row visually different than the other rows by using a background colour', () => {
    const header = 'Header'
    const body = 'Body content'
    render(
      <Table>
        <Head data-testid="head">
          <Row>
            <Cell>{header}</Cell>
          </Row>
        </Head>
        <Body>
          <Row>
            <Cell>{body}</Cell>
          </Row>
        </Body>
      </Table>,
    )
    const headElement = screen.getByTestId('head')
    const regularContent = screen.getByText(body)
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
    render(
      <Table>
        <Body>
          <Row>
            <Cell variant="numeric">{text}</Cell>
          </Row>
        </Body>
      </Table>,
    )
    // deconstructing so linter doesnt have a fit
    const {
      variants: {
        numeric: { typography },
      },
    } = dataCellToken
    const trimmedFontFeature = typography.fontFeature.replace(/\s*,\s*/g, ',')

    expect(screen.getByText(text)).toHaveStyleRule(
      'font-feature-settings',
      trimmedFontFeature,
    )
  })

  const StyledTable = styled(Table)`
    clip-path: unset;
  `

  it('Can extend the css for the component', () => {
    render(<StyledTable />)
    expect(screen.getByRole('table')).toHaveStyleRule('clip-path', 'unset')
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
  /* TODO: Investigate extra space between variable and fallback value
  it('Has comfortable as default density', () => {
    const cellText = 'Cell content'
    const headerText = 'Header content'
    render(
      <Table>
        <Head>
          <Row data-testid="header-row">
            <Cell>{headerText}</Cell>
          </Row>
        </Head>
        <Body>
          <Row data-testid="body-row">
            <Cell>{cellText}</Cell>
          </Row>
        </Body>
      </Table>,
    )

    expect(screen.getByRole('columnheader')).toHaveStyleRule(
      'height',
      headerCellToken.height,
    )
    expect(screen.getByRole('cell')).toHaveStyleRule(
      'height',
      dataCellToken.height,
    )
  })
    it('Has compact density', () => {
    const cellText = 'Cell content'
    const headerText = 'Header content'
    render(
      <EdsProvider density="compact">
        <Table>
          <Head>
            <Row>
              <Cell>{headerText}</Cell>
            </Row>
          </Head>
          <Body>
            <Row>
              <Cell>{cellText}</Cell>
            </Row>
          </Body>
        </Table>
      </EdsProvider>,
    )

    expect(screen.getByRole('columnheader')).toHaveStyleRule(
      'height',
      headerCellToken.modes.compact.height,
    )
    expect(screen.getByRole('cell')).toHaveStyleRule(
      'height',
      dataCellToken.modes.compact.height,
    )
  })*/
  it('Has aria-sort when sort is provided', () => {
    const headerText = 'Cell content'
    render(
      <Table>
        <Head>
          <Row>
            <Cell sort="ascending">{headerText}</Cell>
          </Row>
        </Head>
      </Table>,
    )
    const headerCell = screen.getByRole('columnheader')
    expect(headerCell).toHaveAttribute('aria-sort', 'ascending')
  })
  it('Has active styling when sort is ascending or descending', () => {
    const headerText1 = 'Cell content'
    const headerText2 = 'Cell content 2'
    render(
      <Table>
        <Head>
          <Row>
            <Cell sort="ascending">{headerText1}</Cell>
            <Cell sort="descending">{headerText2}</Cell>
          </Row>
        </Head>
      </Table>,
    )

    const borderBottomColor = trim(
      headerCellToken.states.active.border.type === 'bordergroup'
        ? headerCellToken.states.active.border.bottom.color
        : '',
    )
    const headerCell1 = screen.getAllByRole('columnheader')[0]
    const headerCell2 = screen.getAllByRole('columnheader')[1]

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
