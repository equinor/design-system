import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Story, Meta } from '@storybook/react'
import {
  Table,
  TableProps,
  Typography,
  Icon,
  CellProps,
  Checkbox,
  TextField,
  Switch,
  Button,
  Menu,
} from '@equinor/eds-core-react'
import {
  chevron_down,
  chevron_up,
  save,
  more_vertical,
} from '@equinor/eds-icons'
import './../style.css'
import { tokens } from '@equinor/eds-tokens'

Icon.add({ chevron_down, chevron_up, save, more_vertical })

const { Caption, Body, Row, Cell, Head } = Table
const { MenuItem } = Menu
const { colors } = tokens

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
            <SortCell
              sort={col.sortDirection}
              key={`head-${col.accessor}`}
              onClick={col.sortDirection ? () => onSortClick(col) : undefined}
              isSorted={col.isSorted}
            >
              {col.name}
              <Icon
                name={
                  col.sortDirection === 'descending'
                    ? 'chevron_up'
                    : 'chevron_down'
                }
              />
            </SortCell>
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

export const CompactTableWithInputs: Story<TableProps> = () => {
  const cellValues = toCellValues(data, columns)
  const onChange = (event: React.InputHTMLAttributes<HTMLInputElement>) => {
    // const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // no change logic atm
    return event.value
  }

  const onClick = (event: React.MouseEvent) => {
    event.stopPropagation()
  }

  const [state, setState] = React.useState<{
    buttonEl: HTMLButtonElement
    focus: 'first' | 'last'
  }>({
    focus: 'first',
    buttonEl: null,
  })

  const { focus, buttonEl } = state
  const isOpen = Boolean(buttonEl)

  const openMenu = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    const target = e.target as HTMLButtonElement
    setState({ ...state, buttonEl: target })
  }

  const closeMenu = () => setState({ ...state, buttonEl: null })

  const onKeyPress = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const { key } = e
    switch (key) {
      case 'ArrowDown':
        isOpen ? closeMenu() : openMenu(e)
        break
      case 'ArrowUp':
        isOpen ? closeMenu() : openMenu(e)
        break
      case 'Escape':
        closeMenu()
        break
      default:
        break
    }
  }
  return (
    <Table density="compact">
      <Caption>
        <Typography variant="h2">Fruits cost price</Typography>
      </Caption>
      <Head>
        <Row>
          <Cell key="head-fav">Favourite</Cell>
          {columns.map((col) => (
            <Cell key={`head-${col.accessor}`}>{col.name}</Cell>
          ))}
          <Cell key="head-buy">Buy</Cell>
          <Cell key="head-action">Some action</Cell>
          <Cell key="head-save">Save</Cell>
          <Cell key="head-icon">Icon</Cell>
          <Cell key="head-settings">Settings</Cell>
        </Row>
      </Head>
      <Body>
        {cellValues?.map((row) => (
          <Row key={row.toString()}>
            <Cell>
              <Checkbox label="Label" />
            </Cell>
            {row.map((cellValue, idx) => {
              if (idx === 1) {
                return (
                  <Cell key={cellValue}>
                    <TextField
                      id={cellValue}
                      value={cellValue}
                      onChange={onChange}
                    />
                  </Cell>
                )
              }
              return <Cell key={cellValue}>{cellValue}</Cell>
            })}
            <Cell>
              <Switch label="Label" size="small" />
            </Cell>
            <Cell>
              {' '}
              <Button variant="ghost">Action</Button>
            </Cell>

            <Cell>
              <Button variant="ghost_icon">
                <Icon name="save" title="save"></Icon>
              </Button>
            </Cell>
            <Cell>
              <Icon name="save" />
            </Cell>
            <Cell>
              <Button
                variant="ghost_icon"
                id="menuButton"
                aria-controls="menu-on-button"
                aria-haspopup="true"
                aria-expanded={Boolean(buttonEl)}
                onClick={(e) => (isOpen ? closeMenu() : openMenu(e))}
                onKeyDown={onKeyPress}
              >
                <Icon name="more_vertical" title="more"></Icon>
              </Button>
              <Menu
                id="menu-on-button"
                aria-labelledby="menuButton"
                focus={focus}
                open={Boolean(buttonEl)}
                anchorEl={buttonEl}
                onClose={closeMenu}
              >
                <MenuItem onClick={onClick}>
                  <Typography
                    color={colors.text.static_icons__tertiary.hex}
                    group="navigation"
                    variant="label"
                  >
                    <Icon name="folder" />
                  </Typography>
                  <Typography group="navigation" variant="menu_title">
                    Open
                  </Typography>
                  <Typography
                    color={colors.text.static_icons__tertiary.hex}
                    group="navigation"
                    variant="label"
                  >
                    CTRL+O
                  </Typography>
                </MenuItem>
                <MenuItem active onClick={onClick}>
                  <Typography
                    color={colors.text.static_icons__tertiary.hex}
                    group="navigation"
                    variant="label"
                  >
                    <Icon name="copy" />
                  </Typography>
                  <Typography group="navigation" variant="menu_title">
                    Copy
                  </Typography>
                  <Typography
                    color={colors.text.static_icons__tertiary.hex}
                    group="navigation"
                    variant="label"
                  >
                    CTRL+C
                  </Typography>
                </MenuItem>
              </Menu>
            </Cell>
          </Row>
        ))}
      </Body>
    </Table>
  )
}
