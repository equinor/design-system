import React from 'react'
import styled from 'styled-components'
import { Story, Meta } from '@storybook/react'
import { Table, TableProps, Typography, Icon } from '@equinor/eds-core-react'
import { warning_outlined } from '@equinor/eds-icons'
import { tokens } from '@equinor/eds-tokens'
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
} as Meta

export const simpleTable: Story<TableProps> = () => (
  <Table>
    <Caption>
      <Typography variant="h2">Star Wars Kill Count</Typography>
    </Caption>
    <Head>
      <Row>
        <Cell></Cell>
        <Cell as="th" scope="col">
          Name
        </Cell>
        <Cell as="th" scope="col">
          Allegiance
        </Cell>
        <Cell as="th" scope="col">
          Kill count
        </Cell>
      </Row>
    </Head>
    <Body>
      <Row>
        <Cell></Cell>
        <Cell>Luke Skywalker</Cell>
        <Cell>Republic</Cell>
        <Cell variant="numeric">369470</Cell>
      </Row>
      <Row>
        <Cell></Cell>

        <Cell>Darth Vader</Cell>
        <Cell>Sith</Cell>
        <Cell variant="numeric">59</Cell>
      </Row>
      <Row>
        <Cell>
          <Icon
            data={warning_outlined}
            color={tokens.colors.interactive.danger__text.rgba}
          ></Icon>
        </Cell>
        <Cell>Boba Fett</Cell>
        <Cell>Independet</Cell>
        <Cell variant="numeric" color="error">
          1
        </Cell>
      </Row>
      <Row active>
        <Cell></Cell>
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
