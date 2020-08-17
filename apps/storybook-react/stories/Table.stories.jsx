import React from 'react'
import {
  Table,
  Typography,
  Tooltip,
  Popover,
  Button,
} from '@equinor/eds-core-react'
import './../style.css'

const { Body, Row, Cell, Head } = Table

const { PopoverAnchor, PopoverTitle, PopoverContent } = Popover

export default {
  title: 'Components|Table',
  component: Table,
}

export const simpleTable = () => (
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
)

export function CustomTable() {
  const [active, setActive] = React.useState(null)

  const handleClick = (event) => {
    setActive(event.currentTarget.id)
  }

  const handleHover = (event) => {
    const current = event.currentTarget.id
    setTimeout(() => {
      setActive(current)
    }, 300)
  }

  const handleClose = () => {
    setActive(null)
  }

  return (
    <div className="container">
      <Typography variant="h1" bold>
        Table cells with tooltip and popover
      </Typography>
      <div className="">
        <div className="group">
          <Table>
            <Head>
              <Row>
                <Cell as="th" scope="col">
                  Type
                </Cell>
                <Cell as="th" scope="col">
                  Example
                </Cell>
              </Row>
            </Head>
            <Body>
              <Row>
                <Cell>Tooltip</Cell>
                <Cell>
                  <Tooltip title="Tooltip">Hover me</Tooltip>
                </Cell>
              </Row>
              <Row>
                <Cell>Popover</Cell>
                <Cell>
                  <Popover onClose={handleClose} open={active === '1'}>
                    <PopoverAnchor>
                      <Button id="1" onClick={handleClick}>
                        Click me
                      </Button>
                    </PopoverAnchor>
                    <PopoverTitle>Popover</PopoverTitle>
                    <PopoverContent>Bla bla bla</PopoverContent>
                  </Popover>
                </Cell>
              </Row>
              <Row>
                <Cell>Popover without button</Cell>
                <Cell>
                  <Popover onClose={handleClose} open={active === '2'}>
                    <PopoverAnchor>
                      <p
                        id="2"
                        onMouseEnter={handleHover}
                        onFocus={handleClick}
                      >
                        Hover me
                      </p>
                    </PopoverAnchor>
                    <PopoverTitle>Popover</PopoverTitle>
                    <PopoverContent>Bla bla bla</PopoverContent>
                  </Popover>
                </Cell>
              </Row>
            </Body>
          </Table>
        </div>
      </div>
    </div>
  )
}
