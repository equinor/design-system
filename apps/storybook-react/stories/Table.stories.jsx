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
              <Cell>Col 1</Cell>
              <Cell>Col 2</Cell>
            </Row>
          </Head>
          <Body>
            <Row>
              <Cell>Value 1</Cell>
              <Cell>Value 2</Cell>
            </Row>
            <Row>
              <Cell>Value 1.2</Cell>
              <Cell>Value 2.2</Cell>
            </Row>
          </Body>
        </Table>
      </div>
    </div>
  </div>
))
