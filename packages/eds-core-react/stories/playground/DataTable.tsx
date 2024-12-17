/* eslint-disable react/destructuring-assignment */
import { useState } from 'react'
import { StoryFn } from '@storybook/react'
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
  Autocomplete,
} from '../../src'
import { save, more_vertical, copy, folder } from '@equinor/eds-icons'
import { tokens } from '@equinor/eds-tokens'

Icon.add({ save, more_vertical, copy, folder })

const { Caption, Body, Row, Cell, Head } = Table
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

const MenuButton = ({ row }: { row: string[] }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement>()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const openMenu = () => {
    setIsOpen(true)
  }
  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <>
      <Button
        variant="ghost_icon"
        id={`menu-button-${row.toString()}`}
        aria-controls={`menu-${row.toString()}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        ref={setAnchorEl}
        onClick={() => (isOpen ? closeMenu() : openMenu())}
      >
        <Icon name="more_vertical" title="more"></Icon>
      </Button>
      <Menu
        id={`menu-${row.toString()}`}
        aria-labelledby={`menu-button-${row.toString()}`}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={closeMenu}
      >
        <Menu.Item onClick={closeMenu}>
          <Icon name="folder" size={16} />
          <Typography group="navigation" variant="menu_title">
            Open
          </Typography>
          <Typography
            color={colors.text.static_icons__tertiary.rgba}
            group="navigation"
            variant="label"
            style={{ height: 12 }}
          >
            CTRL+O
          </Typography>
        </Menu.Item>
        <Menu.Item onClick={closeMenu}>
          <Icon name="copy" size={16} />
          <Typography group="navigation" variant="menu_title">
            Copy
          </Typography>
          <Typography
            color={colors.text.static_icons__tertiary.rgba}
            group="navigation"
            variant="label"
            as="span"
            style={{ height: 12 }}
          >
            CTRL+C
          </Typography>
        </Menu.Item>
      </Menu>
    </>
  )
}

export const DataTable: StoryFn<TableProps> = (args) => {
  const cellValues = toCellValues(data, columns)
  const onChange = (event: React.InputHTMLAttributes<HTMLInputElement>) => {
    // const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // no change logic atm
    return event.value
  }

  return (
    <Table {...args}>
      <Caption>
        <Typography variant="h2">Fruits cost price</Typography>
      </Caption>
      <Head>
        <Row>
          <Cell key="head-fav" id="head-fav">
            Favourite
          </Cell>
          {columns.map((col) => (
            <Cell key={`head-${col.accessor}`}>
              <span id={`head-${col.accessor}`}>{col.name}</span>
            </Cell>
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
              <Checkbox aria-labelledby="head-fav" />
            </Cell>
            {row.map((cellValue, idx) => {
              if (idx === 1) {
                return (
                  <Cell key={cellValue}>
                    <TextField
                      id={cellValue}
                      value={cellValue}
                      onChange={onChange}
                      title={cellValue}
                      aria-label={cellValue}
                    />
                  </Cell>
                )
              }
              if (idx === 2) {
                return (
                  <Cell key={cellValue}>
                    <Autocomplete
                      label=""
                      options={items}
                      initialSelectedOptions={[cellValue]}
                      title="Origin"
                      aria-labelledby="head-origin"
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
              <Button>Action</Button>
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
              <MenuButton row={row} />
            </Cell>
          </Row>
        ))}
      </Body>
    </Table>
  )
}
