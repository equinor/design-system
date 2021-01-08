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

export const simpleTable: Story<TableProps> = (args) => (
  <Table {...args}>
    <Caption>
      <Typography variant="h2">Star Wars Kill Count</Typography>
    </Caption>
    <Head>
      <Row>
        <Cell as="th" scope="col">
          Name
        </Cell>
        <Cell as="th" scope="col" sort="none">
          Allegiance
          <Icon name="chevron_down" />
        </Cell>
        <Cell as="th" scope="col" sort="ascending">
          Kill count
          <Typography group="input" variant="label">
            (num)
          </Typography>
          <Icon name="chevron_down" />
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
      <Row>
        <Cell>Boba Fett</Cell>
        <Cell>Independet</Cell>
        <Cell variant="numeric" color="error">
          1
        </Cell>
      </Row>
      <Row active>
        <Cell>Jar Jar Binks</Cell>
        <Cell>Republic</Cell>
        <Cell variant="numeric">44</Cell>
      </Row>
    </Body>
  </Table>
)

const FixedContainer = styled.div`
  width: 200px;
  height: 200px;
  overflow: auto;
`
const StickyHeader = styled(Head)`
  top: 0;
  display: block;
  position: sticky;
`

const FullTable = styled(Table)`
  width: 100%;
  height: 100%;
`

export const FixedTableHeader: Story<TableProps> = () => {
  return (
    <FixedContainer>
      <FullTable>
        <StickyHeader>
          <Row>
            <Cell as="th">Header</Cell>
          </Row>
        </StickyHeader>
        <Body>
          <Row>
            <Cell>Cell 1</Cell>
          </Row>
          <Row>
            <Cell>Cell</Cell>
          </Row>
          <Row>
            <Cell>Cell</Cell>
          </Row>
          <Row>
            <Cell>Cell</Cell>
          </Row>
          <Row>
            <Cell>Cell</Cell>
          </Row>
          <Row>
            <Cell>Cell</Cell>
          </Row>
          <Row>
            <Cell>Cell</Cell>
          </Row>
          <Row>
            <Cell>Cell</Cell>
          </Row>
          <Row>
            <Cell>Cell</Cell>
          </Row>
        </Body>
      </FullTable>
    </FixedContainer>
  )
}

export const CompactTable: Story<TableProps> = () => {
  const data = [
    { number: '1', name: 'Banana', colour: 'Yellow' },
    { number: '2', name: 'Orange', colour: 'Orange' },
    { number: '4', name: 'Kiwi', colour: 'Greenish' },
  ]
  return (
    <Table density="compact">
      <Caption>
        <Typography variant="h2">Fruits and their colours</Typography>
      </Caption>
      <Head>
        <Row>
          <Cell as="th" scope="col">
            Number
          </Cell>
          <Cell as="th" scope="col">
            Name
          </Cell>
          <Cell as="th" scope="col">
            Colour
          </Cell>
        </Row>
      </Head>
      <Body>
        {data.map((item) => {
          return (
            <Row key={item.number}>
              <Cell>{item.number}</Cell>
              <Cell>{item.name}</Cell>
              <Cell>{item.colour}</Cell>
            </Row>
          )
        })}
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
