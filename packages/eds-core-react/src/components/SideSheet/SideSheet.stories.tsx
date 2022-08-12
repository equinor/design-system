import { useState } from 'react'
import styled from 'styled-components'
import {
  SideSheet,
  SideSheetProps,
  Checkbox,
  Button,
  Divider,
  Icon,
  List,
  Scrim,
  Slider,
  Table,
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
        excludeDecorators: true,
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

const Wrapper = styled.div`
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(2, auto);
  padding: 16px 0 0 12px;
`

const SheetWrapper = styled.div`
  overflow-y: auto;
  max-height: 80%;
`

const UnstyledList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
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

export const Placement: Story<SideSheetProps> = () => {
  const [toggle, setToggle] = useState(true)
  const outputFunction = (value: number) => {
    const date = new Date(value)
    return date.toLocaleDateString('nb-NO', {
      year: 'numeric',
    })
  }
  const getUnixTime = (iso: string | number | Date) => {
    return new Date(iso).getTime()
  }

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setToggle(!toggle)}
        style={{ float: 'right' }}
      >
        Filters
      </Button>
      <List variant="numbered">
        <List.Item>
          List of Tables
          <List variant="bullet">
            <List.Item>Products</List.Item>
            <List.Item>Prices</List.Item>
            <List.Item>Tax</List.Item>
            <List.Item>Customers</List.Item>
            <List.Item>Companies</List.Item>
            <List.Item>Insurance</List.Item>
          </List>
        </List.Item>
        <br />
        <List.Item>
          Graphs
          <List variant="bullet">
            <List.Item>Sell statistics</List.Item>
            <List.Item>Usage statistics</List.Item>
            <List.Item>Return statistics</List.Item>
            <List.Item>Losses statistics</List.Item>
            <List.Item>Profits statistics</List.Item>
          </List>
        </List.Item>
        <br />
        <List.Item>
          Documentation
          <List variant="bullet">
            <List.Item>Comments</List.Item>
            <List.Item>System Documentation</List.Item>
            <List.Item>General Policies</List.Item>
            <List.Item>Internal Policies</List.Item>
            <List.Item>Manuals</List.Item>
          </List>
        </List.Item>
      </List>

      <SideSheet
        open={toggle}
        onClose={() => setToggle(!toggle)}
        style={{ height: '90%' }}
      >
        <div style={{ padding: '0 5px' }}>
          <Typography variant="h4">Filters</Typography>
          <br />
          <Typography variant="h6" color="disabled">
            Labels
          </Typography>
          <UnstyledList>
            <li>
              <Checkbox
                label="Tables"
                name="multiple"
                value="first"
                defaultChecked
              />
            </li>
            <li>
              <Checkbox label="Graphs" name="multiple" value="second" />
            </li>
            <li>
              <Checkbox label="Documentation" name="multiple" value="third" />
            </li>
          </UnstyledList>
          <br />
          <Typography id="range-slider-label" variant="h6" color="disabled">
            Year range
          </Typography>
          <Slider
            min={getUnixTime('1960')}
            max={getUnixTime('2020')}
            ariaLabelledby="date-range-slider"
            value={[getUnixTime('1980'), getUnixTime('2000')]}
            outputFunction={outputFunction}
          />
        </div>
      </SideSheet>
    </>
  )
}

export const Scrollable: Story<SideSheetProps> = () => {
  const cellValues = toCellValues(data, columns)
  const [open, setOpen] = useState(false)

  return (
    <>
      <Table style={{ width: '100%' }}>
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
                <Button variant="ghost_icon" onClick={() => setOpen(!open)}>
                  <Icon name="more_vertical" size={16} title="details" />
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Scrim
        open={open}
        onClose={() => setOpen(!open)}
        isDismissable
        style={{ position: 'absolute' }}
      >
        <SideSheet
          open={open}
          onClose={() => setOpen(!open)}
          style={{ overflowY: 'hidden' }}
        >
          <SheetWrapper>
            <Typography variant="h4">Details</Typography>
            <Divider />
            <Typography variant="h6" color="disabled">
              Information
            </Typography>
            <Wrapper>
              <Icon name="place" title="place" color="#007079" />
              <Typography>place</Typography>
              <Icon
                name="calendar_date_range"
                title="calendar"
                color="#007079"
              />
              <Typography>date</Typography>
              <Icon name="label" title="label" color="#007079" />
              <Typography>labels</Typography>
              <Icon
                name="file_description"
                title="description"
                color="#007079"
              />
              <Typography>description</Typography>
            </Wrapper>
            <Divider />
            <Typography variant="h6" color="disabled">
              Add labels
            </Typography>
            <UnstyledList>
              <li>
                <Checkbox label="Fruits" name="multiple" />
              </li>
              <li>
                <Checkbox label="Vegetables" name="multiple" />
              </li>
              <li>
                <Checkbox label="Favourites" name="multiple" />
              </li>
            </UnstyledList>
          </SheetWrapper>
        </SideSheet>
      </Scrim>
    </>
  )
}
