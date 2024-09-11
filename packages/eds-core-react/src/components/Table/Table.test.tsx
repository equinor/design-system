/* eslint-disable no-undef */
import { render, screen, within } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Table } from '.'
import styled from 'styled-components'
import { tableCell as dataCellToken } from './DataCell/DataCell.tokens'
import { token as headerCellToken } from './HeaderCell/HeaderCell.tokens'

const { Caption, Cell, Head, Row, Body, Foot } = Table

const RenderFooterTable = ({ sticky = false }: { sticky?: boolean }) => {
  return (
    <Table>
      <Head>
        <Row>
          <Cell>Country</Cell>
          <Cell>Tax</Cell>
          <Cell>Discount</Cell>
        </Row>
      </Head>
      <Body>
        <Row>
          <Cell>Italy</Cell>
          <Cell>42</Cell>
          <Cell>12</Cell>
        </Row>
        <Row>
          <Cell>Norway</Cell>
          <Cell>50</Cell>
          <Cell>10</Cell>
        </Row>
        <Row>
          <Cell>Swedend</Cell>
          <Cell>32</Cell>
          <Cell>15</Cell>
        </Row>
      </Body>
      <Foot data-testid="footer" sticky={sticky}>
        <Row>
          <Cell>Total</Cell>
          <Cell>54</Cell>
          <Cell>4</Cell>
        </Row>
      </Foot>
    </Table>
  )
}

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

    expect(asFragment()).toMatchSnapshot()
  })
  it('Should pass a11y test', async () => {
    const { container } = render(
      <Table>
        <Head>
          <Row>
            <Cell>content</Cell>
          </Row>
        </Head>
      </Table>,
    )
    expect(await axe(container)).toHaveNoViolations()
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
    const cellBackground = headerCellToken.background
    const cellBorderBottom =
      headerCellToken.border.type === 'bordergroup'
        ? `${headerCellToken.border.bottom.width} ${headerCellToken.border.bottom.style} ${headerCellToken.border.bottom.color}`
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
      dataCellToken.states.active.background,
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
      dataCellToken.validation.error.background,
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

    const borderBottomColor =
      headerCellToken.states.active.border.type === 'bordergroup'
        ? headerCellToken.states.active.border.bottom.color
        : ''

    const headerCell1 = screen.getAllByRole('columnheader')[0]
    const headerCell2 = screen.getAllByRole('columnheader')[1]

    expect(headerCell1).toHaveAttribute('aria-sort', 'ascending')
    expect(headerCell2).toHaveAttribute('aria-sort', 'descending')

    expect(headerCell1).toHaveStyleRule(
      'background',
      headerCellToken.states.active.background,
    )
    expect(headerCell1).toHaveStyleRule(
      'color',
      headerCellToken.states.active.typography.color,
    )
    expect(headerCell1).toHaveStyleRule('border-color', borderBottomColor)

    expect(headerCell2).toHaveStyleRule(
      'background',
      headerCellToken.states.active.background,
    )
    expect(headerCell2).toHaveStyleRule(
      'color',
      headerCellToken.states.active.typography.color,
    )
    expect(headerCell2).toHaveStyleRule('border-color', borderBottomColor)
  })
  it('Renders a table with fixed footer if <Foot> is provided', () => {
    render(<RenderFooterTable sticky />)
    const foot = screen.getByTestId('footer') // Assert Footer is available in the document
    expect(foot).toBeInTheDocument()
    const thElements = within(foot).getAllByRole('columnheader')
    thElements.forEach((th) => {
      expect(th).toHaveStyle('position: sticky') // Ensure this one is sticky
    })
  })
  it('Renders a table with footer ( not fixed ) if <Foot> is provided', () => {
    render(<RenderFooterTable />)
    const foot = screen.getByTestId('footer') // Assert Footer is available in the document
    expect(foot).toBeInTheDocument()
    const thElements = within(foot).getAllByRole('columnheader')
    thElements.forEach((th) => {
      expect(th).not.toHaveStyle('position: sticky') // Ensure this one is not sticky
    })
  })
})
