import React from 'react'
import styled from 'styled-components'
import { Story, Meta } from '@storybook/react'
import { Table, TableProps, Typography } from '@equinor/eds-core-react'
import './../style.css'

const { Caption, Body, Row, Cell, Head } = Table

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
        <Cell as="th" scope="col" sortDirection="none">
          Allegiance
        </Cell>
        <Cell as="th" scope="col" sortDirection="ascending">
          Kill count
          <Typography group="input" variant="label" color="currentColor">
            (num)
          </Typography>
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
