import React from 'react'
import { Story, Meta } from '@storybook/react'
import {
  Table,
  TableProps,
  Typography,
  Icon,
  Checkbox,
  TextField,
  Switch,
  Button,
  Menu,
  SingleSelect,
} from '@components'
import { save, more_vertical } from '@equinor/eds-icons'
import './styles/style.css'
import { tokens } from '@equinor/eds-tokens'

Icon.add({ save, more_vertical })

const { Caption, Body, Row, Cell, Head } = Table
const { MenuItem } = Menu
const { colors } = tokens

type Data = {
  number: string
  description: string
  origin: string
  price: number
}

const items = ['Europe', 'Africa', 'South America', 'Australia']

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
  title: 'Playground/CompactDataGrid',
  parameters: {
    viewMode: 'story',
    docs: {
      description: {
        component: `A playground for testing input fields in tables.`,
      },
    },
  },
} as Meta

export const CompactDataGrid: Story<TableProps> = () => {
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
              if (idx === 2) {
                return (
                  <Cell key={cellValue}>
                    <SingleSelect
                      label="Label"
                      initialSelectedItem={cellValue}
                      items={items}
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
