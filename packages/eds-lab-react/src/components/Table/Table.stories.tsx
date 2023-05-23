import styled, { css } from 'styled-components'
import { StoryObj, StoryFn, Meta } from '@storybook/react'
import { Table, TableProps, Typography } from '@equinor/eds-core-react'
import { data, multilineText, columns } from '../../stories/data'
import { toCellValues } from '../../stories/toCellValues'

export default {
  title: 'Core-react experimental features/css-variables/Multiline table',
  component: Table,
  parameters: {
    docs: {
      description: {
        component: `Enable multiline table-cells via css-variable overrides`,
      },
    },
  },
} as Meta

export const Default: StoryObj<TableProps> = {
  render: (args) => {
    const cellValues = toCellValues([...data, multilineText], columns)

    const CellNoWrap = styled(Table.Cell)`
      white-space: nowrap;
    `

    const vars = css`
      --eds_table__cell__height: auto;
      --eds_table__cell__padding_y: 1em;
      --eds_table__cell__vertical_align: top;
    `

    return (
      <Table {...args} css={vars}>
        <Table.Caption>
          <Typography variant="h2">Fruits cost price</Typography>
        </Table.Caption>
        <Table.Head>
          <Table.Row>
            {columns.map((col) => (
              <CellNoWrap key={`head-${col.accessor}`}>{col.name}</CellNoWrap>
            ))}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {cellValues?.map((row) => (
            <Table.Row key={row.toString()}>
              {row.map((cellValue, index) =>
                index < 2 ? (
                  <CellNoWrap key={cellValue}>{cellValue}</CellNoWrap>
                ) : (
                  <Table.Cell key={cellValue}>{cellValue}</Table.Cell>
                ),
              )}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )
  },
}
