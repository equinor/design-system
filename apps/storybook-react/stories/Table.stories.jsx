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
              <Cell as="th" scope="col"></Cell>
              <Cell as="th" scope="col">
                Empire
              </Cell>
              <Cell as="th" scope="col">
                Republic
              </Cell>
            </Row>
          </Head>
          <Body>
            <Row>
              <Cell as="th" scope="row">
                Jedi
              </Cell>
              <Cell></Cell>
              <Cell>Luke Skywalker</Cell>
            </Row>
            <Row>
              <Cell as="th" scope="row">
                Sith
              </Cell>
              <Cell>Darth Vader</Cell>
              <Cell></Cell>
            </Row>
          </Body>
        </Table>
      </div>
    </div>
  </div>
))
