import React from 'react'
import { render } from '@testing-library/react'
import { Table } from '.'

const { Head, Row, Cell, Body } = Table

describe('Table', () => {
  it('Renders a table', () => {
    const { getByText } = render(
      <Table>
        <Head>
          <Row>
            <Cell as="th">
              Name
            </Cell>
            <Cell as="th">
              Allegiance
            </Cell>
            <Cell as="th">
              Kill count
            </Cell>
          </Row>
        </Head>
        <Body>
          <Row>
            <Cell>Luke Skywalker</Cell>
            <Cell>Republic</Cell>
            <Cell variant="numeric">369470</Cell>
          </Row>
          <Row>
            <Cell>Darth Vader</Cell>
            <Cell>Sith</Cell>
            <Cell variant="numeric">59</Cell>
          </Row>
        </Body>
      </Table>,
    )

    expect(getByText('Luke Skywalker')).toBeInTheDocument()
  })
})
