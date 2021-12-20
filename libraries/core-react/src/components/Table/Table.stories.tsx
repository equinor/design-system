import { useEffect, useState, useRef, useCallback } from 'react'
import styled from 'styled-components'
import { Story, Meta } from '@storybook/react'
import {
  Table,
  TableProps,
  Typography,
  Icon,
  CellProps,
  TopBar,
  Menu,
  Button,
  EdsProvider,
  EdsProviderProps,
} from '../..'
import { arrow_down, arrow_up, accessible } from '@equinor/eds-icons'
import { data, columns, Column, Data, SortDirection } from '../../stories/data'

import { toCellValues } from '../../stories/toCellValues'

Icon.add({ arrow_down, arrow_up })

const { Caption, Body, Row, Cell, Head } = Table

export default {
  title: 'Components/Table',
  component: Table,
  subcomponents: { Caption, Body, Row, Cell, Head },
  parameters: {
    docs: {
      description: {
        component: `A basic table component`,
      },
    },
  },
  args: {
    density: 'comfortable',
  },
  argTypes: {
    density: {
      options: ['comfortable', 'compact'],
      control: {
        type: 'select',
      },
    },
  },
} as Meta

export const simpleTable: Story<TableProps> = (args) => {
  const cellValues = toCellValues(data, columns)

  return (
    <Table {...args}>
      <Table.Caption>
        <Typography variant="h2">Fruits cost price</Typography>
      </Table.Caption>
      <Table.Head>
        <Table.Row>
          {columns.map((col) => (
            <Table.Cell key={`head-${col.accessor}`}>{col.name}</Table.Cell>
          ))}
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {cellValues?.map((row) => (
          <Table.Row key={row.toString()}>
            {row.map((cellValue) => (
              <Table.Cell key={cellValue}>{cellValue}</Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

const FixedContainer = styled.div`
  height: 200px;
  overflow: auto;
`

export const FixedTableHeader: Story<TableProps> = () => {
  const cellValues = toCellValues(data, columns)
  const buttonIndex = cellValues[0].length - 1

  return (
    <FixedContainer>
      <Table>
        <Table.Caption>
          <Typography variant="h2">Fruits cost price</Typography>
        </Table.Caption>
        <Table.Head sticky>
          <Table.Row>
            {columns.map((col) => (
              <Table.Cell key={`head-${col.accessor}`}>{col.name}</Table.Cell>
            ))}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {cellValues?.map((row) => (
            <Table.Row key={row.toString()}>
              {row.map((cellValue, index) => (
                <Table.Cell key={cellValue}>
                  {index === buttonIndex ? (
                    <Button variant="outlined">{cellValue}</Button>
                  ) : (
                    cellValue
                  )}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </FixedContainer>
  )
}

export const CompactTable: Story<TableProps> = () => {
  const cellValues = toCellValues(data, columns)

  const [state, setState] = useState<{
    isOpen: boolean
    density: EdsProviderProps['density']
  }>({
    isOpen: false,
    density: 'comfortable',
  })

  const { density, isOpen } = state

  const setDensity = (density: 'comfortable' | 'compact') =>
    setState((prevState) => ({ ...prevState, density }))

  const openMenu = () => {
    setState((prevState) => ({ ...prevState, isOpen: true }))
  }

  const closeMenu = () =>
    setState((prevState) => ({ ...prevState, isOpen: false }))

  const onKeyPress = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const { key } = e
    switch (key) {
      case 'ArrowDown':
        isOpen ? closeMenu() : openMenu()
        break
      case 'ArrowUp':
        isOpen ? closeMenu() : openMenu()
        break
      case 'Escape':
        closeMenu()
        break
      default:
        break
    }
  }

  const referenceElement = useRef<HTMLButtonElement>(null)

  return (
    <div>
      <TopBar>
        <TopBar.Header>Compact table with switcher</TopBar.Header>
        <TopBar.Actions>
          <Button
            ref={referenceElement}
            variant="ghost_icon"
            id="menuButton"
            aria-controls="menu-on-button"
            aria-haspopup="true"
            aria-expanded={isOpen}
            onClick={() => (isOpen ? closeMenu() : openMenu())}
            onKeyDown={onKeyPress}
          >
            <Icon data={accessible} title="accessible"></Icon>
          </Button>
          <Menu
            id="menu-on-button"
            open={isOpen}
            aria-labelledby="menuButton"
            anchorEl={referenceElement.current}
            onClose={closeMenu}
          >
            <Menu.Section title="Density">
              <Menu.Item onClick={() => setDensity('comfortable')}>
                Comfortable
              </Menu.Item>
              <Menu.Item onClick={() => setDensity('compact')}>
                Compact
              </Menu.Item>
            </Menu.Section>
          </Menu>
        </TopBar.Actions>
      </TopBar>
      <EdsProvider density={density}>
        <Table>
          <Table.Caption>
            <Typography variant="h2">Fruits cost price</Typography>
          </Table.Caption>
          <Table.Head>
            <Table.Row>
              {columns.map((col) => (
                <Table.Cell key={`head-${col.accessor}`}>{col.name}</Table.Cell>
              ))}
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {cellValues?.map((row) => (
              <Table.Row key={row.toString()}>
                {row.map((cellValue) => (
                  <Table.Cell key={cellValue}>{cellValue}</Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </EdsProvider>
    </div>
  )
}

CompactTable.parameters = {
  docs: {
    description: {
      story:
        'Compact `Table` using `EdsProvider` (this will also apply compact on all nested components)',
    },
  },
}

const SortCell = styled(Cell)<{ isSorted: boolean } & CellProps>`
  svg {
    visibility: ${({ isSorted }) => (isSorted ? 'visible' : 'hidden')};
  }
  &:hover {
    svg {
      visibility: visible;
    }
  }
`
export const Sortable: Story<TableProps> = () => {
  const [state, setState] = useState<{
    columns: Column[]
    cellValues?: string[][]
  }>({ columns })

  const onSortClick = (sortCol: Column) => {
    const updateColumns = state.columns.map((col) => {
      if (sortCol.accessor === col.accessor) {
        let isSorted = true
        let sortDirection: SortDirection = 'none'
        switch (sortCol.sortDirection) {
          case 'descending':
            isSorted = false
            sortDirection = 'none'
            break
          case 'ascending':
            sortDirection = 'descending'
            break
          default:
            sortDirection = 'ascending'
            break
        }

        return {
          ...sortCol,
          isSorted,
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

  const sortData = useCallback(
    (data: Data[]) =>
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
      }),
    [state.columns],
  )

  useEffect(() => {
    if (state.columns) {
      const sorted = sortData(data)
      const cellValues = toCellValues(sorted, columns)
      setState((prevState) => ({ ...prevState, cellValues }))
    }
  }, [state.columns, setState, sortData])

  return (
    <Table>
      <Table.Caption>
        <Typography variant="h2">Fruits cost price</Typography>
      </Table.Caption>
      <Table.Head>
        <Table.Row>
          {state.columns.map((col) => (
            <SortCell
              sort={col.sortDirection}
              key={`head-${col.accessor}`}
              onClick={col.sortDirection ? () => onSortClick(col) : undefined}
              isSorted={col.isSorted}
            >
              {col.name}
              <Icon
                name={
                  col.sortDirection === 'descending' ? 'arrow_down' : 'arrow_up'
                }
              />
            </SortCell>
          ))}
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {state.cellValues?.map((row) => (
          <Table.Row key={row.toString()}>
            {row.map((cellValue) => (
              <Table.Cell key={cellValue}>{cellValue}</Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}
