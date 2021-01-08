import React, { useEffect } from 'react'
import styled from 'styled-components'
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
  name: string
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
    name: 'Price',
    accessor: 'price',
    sortDirection: 'none',
  },
]

// type PrepareData<T extends typeof data> = (data: T, columns: Column) => T[][]

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
      <Head>
        <Row>
          {columns.map((col) => (
            <Cell as="th" key={`head-${col.name}`}>
              {col.name}
            </Cell>
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

export const FixedTableHeader: Story<TableProps> = () => {
  const cellValues = toCellValues(data, columns)

  return (
    <FixedContainer>
      <Table>
        <Head>
          <Row>
            {columns.map((col) => (
              <Cell
                as="th"
                key={`head-${col.name}`}
                style={{
                  position: 'sticky',
                  top: 0,
                }}
              >
                {col.name}
              </Cell>
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
        <Typography variant="h2">Fruits and their colours</Typography>
      </Caption>
      <Head>
        <Row>
          {columns.map((col) => (
            <Cell as="th" key={`head-${col.name}`}>
              {col.name}
            </Cell>
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
      <Head>
        <Row>
          {state.columns.map((col) => (
            <Cell
              as="th"
              sort={col.sortDirection}
              key={`head-${col.name}`}
              onClick={col.sortDirection ? () => onSortClick(col) : undefined}
            >
              {col.name}
              {col.isSorted && (
                <Icon
                  name={
                    col.sortDirection === 'ascending'
                      ? 'chevron_down'
                      : 'chevron_up'
                  }
                />
              )}
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
