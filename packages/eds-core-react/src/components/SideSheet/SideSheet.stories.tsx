import { FormEvent, useState } from 'react'
import styled from 'styled-components'
import {
  SideSheet,
  SideSheetProps,
  Checkbox,
  Button,
  Divider,
  Icon,
  Search,
  Slider,
  Table,
  TextField,
  TopBar,
  Typography,
} from '../..'
import { toCellValues } from '../../stories/toCellValues'
import { data, columns } from '../../stories/data'
import { Story, ComponentMeta } from '@storybook/react'
import page from './SideSheet.docs.mdx'

export default {
  title: 'Surfaces/SideSheet',
  component: SideSheet,
  args: {
    title: 'Title',
  },
  parameters: {
    docs: {
      page,
      source: {
        type: 'code',
      },
    },
  },
} as ComponentMeta<typeof SideSheet>

const Child = styled.div`
  padding: 6px;
  background-color: rgba(255, 146, 0, 0.15);
  box-sizing: border-box;
  border: 1px dashed #ff9200;
  border-radius: 4px;
`

const Container = styled.div`
  display: grid;
  grid-template-rows: 64px auto;
  height: 100%;
`

const Icons = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  > * {
    margin-left: 40px;
  }
`

const Wrapper = styled.div`
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(2, fit-content(100%));
  padding-top: 16px;
`

export const Introduction: Story<SideSheetProps> = (args) => {
  const [toggle, setToggle] = useState(true)
  return (
    <div style={{ height: '400px', position: 'relative' }}>
      <Button variant="outlined" onClick={() => setToggle(!toggle)}>
        Click me!
      </Button>
      <SideSheet {...args} open={toggle} onClose={() => setToggle(!toggle)}>
        <Child>Children</Child>
      </SideSheet>
    </div>
  )
}

export const Filters: Story<SideSheetProps> = () => {
  const cellValues = toCellValues(data, columns)
  const [toggle, setToggle] = useState(false)
  const [value, updateValue] = useState([1, 50])
  const changeHandler = (
    event: FormEvent<HTMLDivElement>,
    value: number[] | number,
  ) => {
    updateValue(value as number[])
  }

  const UnstyledList = styled.ul`
    margin: 0;
    padding: 0;
    list-style-type: none;
  `

  return (
    <Container>
      <TopBar>
        <TopBar.Header>Files</TopBar.Header>
        <TopBar.CustomContent>
          <Search
            aria-label="sitewide"
            id="search-normal"
            placeholder="Search"
          />
        </TopBar.CustomContent>
        <TopBar.Actions>
          <Icons>
            <Icon name="account_circle" size={16} title="user" />
            <Icon name="notifications" size={16} />
            <Button variant="ghost_icon" onClick={() => setToggle(!toggle)}>
              <Icon name="filter_list" size={16} />
            </Button>
          </Icons>
        </TopBar.Actions>
      </TopBar>
      <Table>
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
      <SideSheet open={toggle} onClose={() => setToggle(!toggle)}>
        <div style={{ padding: '6px' }}>
          <Typography variant="h4">Filters</Typography>
          <br />
          <Typography variant="h6" color="disabled">
            Labels
          </Typography>
          <UnstyledList>
            <li>
              <Checkbox
                label="Fruits"
                name="multiple"
                value="first"
                defaultChecked
              />
            </li>
            <li>
              <Checkbox label="Vegetables" name="multiple" value="second" />
            </li>
            <li>
              <Checkbox label="Favourites" name="multiple" value="third" />
            </li>
          </UnstyledList>
          <br />
          <Typography id="range-slider-label" variant="h6" color="disabled">
            Price range
          </Typography>
          <Slider
            value={value}
            onChange={changeHandler}
            ariaLabelledby="range-slider-label"
          />
          <p style={{ marginTop: '1.5rem' }}>
            <small>$: {value.join(', ')}</small>
          </p>
        </div>
      </SideSheet>
    </Container>
  )
}

export const Details: Story<SideSheetProps> = () => {
  const cellValues = toCellValues(data, columns)
  const [toggle, setToggle] = useState(true)

  const UnstyledList = styled.ul`
    margin: 0;
    padding: 0;
    list-style-type: none;
  `

  return (
    <Container>
      <TopBar>
        <TopBar.Header>Files</TopBar.Header>
        <TopBar.CustomContent>
          <Search
            aria-label="sitewide"
            id="search-normal"
            placeholder="Search"
          />
        </TopBar.CustomContent>
        <TopBar.Actions>
          <Icons>
            <Icon name="account_circle" size={16} title="user" />
            <Icon name="notifications" size={16} title="notifications" />
          </Icons>
        </TopBar.Actions>
      </TopBar>
      <Table>
        <Table.Head>
          <Table.Row>
            {columns.map((col) => (
              <Table.Cell key={`head-${col.accessor}`}>{col.name}</Table.Cell>
            ))}
            <Table.Cell key="head-buy">Details</Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {cellValues?.map((row) => (
            <Table.Row key={row.toString()}>
              {row.map((cellValue) => (
                <Table.Cell key={cellValue}>{cellValue}</Table.Cell>
              ))}
              <Table.Cell>
                <Button variant="ghost_icon" onClick={() => setToggle(!toggle)}>
                  <Icon name="details" size={16} title="details" />
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <SideSheet open={toggle} onClose={() => setToggle(!toggle)}>
        <div style={{ padding: '6px' }}>
          <Typography variant="h4">Details</Typography>
          <TextField
            id="storybook-details"
            placeholder="Add description"
            inputIcon={<Icon name="edit" title="Add description" />}
            style={{ paddingTop: '16px' }}
          ></TextField>
          <Divider style={{ marginLeft: '-20px', marginRight: '-20px' }} />
          <Typography variant="h6" color="disabled">
            Information
          </Typography>
          <Wrapper>
            <Icon name="place" title="place" color="#007079" />
            <Typography>place</Typography>
            <Icon name="calendar_date_range" title="calendar" color="#007079" />
            <Typography>date</Typography>
            <Icon name="label" title="label" color="#007079" />
            <Typography>labels</Typography>
            <Icon name="file_description" title="description" color="#007079" />
            <Typography>description</Typography>
          </Wrapper>
          <Divider style={{ marginLeft: '-20px', marginRight: '-20px' }} />
          <Typography variant="h6" color="disabled">
            Add labels
          </Typography>
          <UnstyledList>
            <li>
              <Checkbox label="Fruits" name="multiple" value="first" />
            </li>
            <li>
              <Checkbox label="Vegetables" name="multiple" value="second" />
            </li>
            <li>
              <Checkbox label="Favourites" name="multiple" value="third" />
            </li>
          </UnstyledList>
        </div>
      </SideSheet>
    </Container>
  )
}
