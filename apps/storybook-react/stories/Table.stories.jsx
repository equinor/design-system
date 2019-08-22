import React from 'react'
import { storiesOf } from '@storybook/react'
import { Table, Typography } from '@equinor/eds-core-react'
import './../style.css'

const { Body, Row, Cell, Head } = Table

storiesOf('Components', module).add('Table', () => (
  <div className="container">
    <Typography variant="h1" bold>
      Table
    </Typography>
    <div className="">
      <div className="group">
        <Table>
          <Head>
            <Row>
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
              <Cell>Luke Skywalker</Cell>
              <Cell>Republic</Cell>
              <Cell variant="numeric">369470</Cell>
            </Row>
            <Row>
              <Cell>Darth Vader</Cell>
              <Cell>Sith</Cell>
              <Cell variant="numeric">59</Cell>
            </Row>
          </Body>
        </Table>
      </div>
    </div>
  </div>
))
