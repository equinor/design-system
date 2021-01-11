import React, { useEffect } from 'react'
import styled from 'styled-components'
import type { CSSProperties } from 'styled-components'
import { Story, Meta } from '@storybook/react'
import { Table, TableProps, Typography, Icon } from '@equinor/eds-core-react'
import { chevron_down, chevron_up } from '@equinor/eds-icons'
import './../style.css'

Icon.add({ chevron_down, chevron_up })

const { Caption, Body, Row, Cell, Head } = Table

type Data = {
  number: string
  description: string
  origin: string
  price: number
}

const data: Data[] = [
  {
    number: '123-456',
    description: 'Pears',
    origin: 'Europe',
    price: 1.5,
  },
  {
    number: '234-567',
    description: 'Apples',
    origin: 'Africa',
    price: 1.2,
  },
  {
    number: '45-6789',
    description: 'Oranges',
    origin: 'South America',
    price: 1.8,
  },
  {
    number: '67-890',
    description: 'Kiwi',
    origin: 'Australia',
    price: 2.1,
  },
  {
    number: '89-012',
    description: 'Mango',
    origin: 'South Africa',
    price: 2.5,
  },
]

type SortDirection = 'ascending' | 'descending' | 'none'
type Column = {
  name: string | React.ReactNode
  accessor: string
  sortDirection?: SortDirection
  isSorted?: boolean
}

const columns: Column[] = [
  {
    name: 'Item nr',
    accessor: 'number',
    sortDirection: 'none',
  },
  {
    name: 'Description',
    accessor: 'description',
    sortDirection: 'none',
  },
  {
    name: 'Origin',
    accessor: 'origin',
    sortDirection: 'none',
  },
  {
    name: (
      <>
        Price &nbsp;
        <Typography group="input" variant="label" color="currentColor">
          ($)
        </Typography>
      </>
    ),
    accessor: 'price',
    sortDirection: 'none',
  },
]

const toCellValues = (data: Data[], columns: Column[]) =>
  data.map((item) =>
    columns.map((column) =>
      typeof item[column.accessor] !== 'undefined'
        ? (item[column.accessor] as string)
        : '',
    ),
  )

export default {
  title: 'Components/Table',
  component: Table,
  subcomponents: { Body, Row, Cell, Head },
  parameters: {
    docs: {
      description: {
        component: `A basic table component`,
      },
    },
  },
  argTypes: {
    density: {
      control: {
        type: 'select',
        options: ['comfortable', 'compact'],
        defaultValue: 'comfortable',
      },
    },
  },
} as Meta

export const simpleTable: Story<TableProps> = (args) => {
  const cellValues = toCellValues(data, columns)

  return (
    <Table {...args}>
      <Caption>
        <Typography variant="h2">Fruits cost price</Typography>
      </Caption>
      <Head>
        <Row>
          {columns.map((col) => (
            <Cell key={`head-${col.accessor}`}>{col.name}</Cell>
          ))}
        </Row>
      </Head>
      <Body>
        {cellValues?.map((row) => (
          <Row key={row.toString()}>
            {row.map((cellValue) => (
              <Cell key={cellValue}>{cellValue}</Cell>
            ))}
          </Row>
        ))}
      </Body>
    </Table>
  )
}

const FixedContainer = styled.div`
  height: 200px;
  overflow: auto;
`

const StickyCell = styled(Cell)`
  position: sticky;
  top: 0;
`

export const FixedTableHeader: Story<TableProps> = () => {
  const cellValues = toCellValues(data, columns)

  return (
    <FixedContainer>
      <Table>
        <Caption>
          <Typography variant="h2">Fruits cost price</Typography>
        </Caption>
        <Head>
          <Row>
            {columns.map((col) => (
              <StickyCell key={`head-${col.accessor}`}>{col.name}</StickyCell>
            ))}
          </Row>
        </Head>
        <Body>
          {cellValues?.map((row) => (
            <Row key={row.toString()}>
              {row.map((cellValue) => (
                <Cell key={cellValue}>{cellValue}</Cell>
              ))}
            </Row>
          ))}
        </Body>
      </Table>
    </FixedContainer>
  )
}

export const CompactTable: Story<TableProps> = () => {
  const cellValues = toCellValues(data, columns)

  return (
    <Table density="compact">
      <Caption>
        <Typography variant="h2">Fruits cost price</Typography>
      </Caption>
      <Head>
        <Row>
          {columns.map((col) => (
            <Cell key={`head-${col.accessor}`}>{col.name}</Cell>
          ))}
        </Row>
      </Head>
      <Body>
        {cellValues?.map((row) => (
          <Row key={row.toString()}>
            {row.map((cellValue) => (
              <Cell key={cellValue}>{cellValue}</Cell>
            ))}
          </Row>
        ))}
      </Body>
    </Table>
  )
}

export const Sortable: Story<TableProps> = () => {
  const [state, setState] = React.useState<{
    columns: Column[]
    cellValues?: string[][]
  }>({ columns })

  const onSortClick = (sortCol: Column) => {
    const updateColumns = state.columns.map((col) => {
      if (sortCol.accessor === col.accessor) {
        const sortDirection: SortDirection =
          sortCol.sortDirection === 'descending' ? 'ascending' : 'descending'

        return {
          ...sortCol,
          isSorted: true,
          sortDirection,
        }
      }
      return {
        ...col,
        isSorted: false,
        sortDirection: col.sortDirection
          ? ('none' as SortDirection)
          : undefined,
      }
    })

    setState({ ...state, columns: updateColumns })
  }

  const sortData = (data: Data[]) =>
    data.sort((left, right) => {
      const sortedCol = state.columns.find((col) => col.isSorted)
      if (!sortedCol) {
        return 1
      }
      const { sortDirection, accessor } = sortedCol
      if (sortDirection === 'ascending') {
        return left[accessor] > right[accessor] ? 1 : -1
      }
      if (sortDirection === 'descending') {
        return left[accessor] < right[accessor] ? 1 : -1
      }
    })

  useEffect(() => {
    if (state.columns) {
      const sorted = sortData(data)
      const cellValues = toCellValues(sorted, columns)
      setState({ ...state, cellValues })
    }
  }, [state.columns])

  return (
    <Table>
      <Caption>
        <Typography variant="h2">Fruits cost price</Typography>
      </Caption>
      <Head>
        <Row>
          {state.columns.map((col) => (
            <Cell
              sort={col.sortDirection}
              key={`head-${col.accessor}`}
              onClick={col.sortDirection ? () => onSortClick(col) : undefined}
            >
              {col.name}
              <Icon
                style={col.isSorted ? {} : { visibility: 'hidden' }}
                name={
                  col.sortDirection === 'ascending'
                    ? 'chevron_down'
                    : 'chevron_up'
                }
              />
            </Cell>
          ))}
        </Row>
      </Head>
      <Body>
        {state.cellValues?.map((row) => (
          <Row key={row.toString()}>
            {row.map((cellValue) => (
              <Cell key={cellValue}>{cellValue}</Cell>
            ))}
          </Row>
        ))}
      </Body>
    </Table>
  )
}
