import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { Tooltip, TooltipProps, Typography, Button, Table } from '@components'
import { Story, Meta } from '@storybook/react'

const Body = styled.div`
  margin: 42px;
  display: grid;
  grid-auto-columns: auto;
`

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 64px;
  grid-template-columns: repeat(3, fit-content(100%));
`

const TextWrapper = styled.div`
  margin-bottom: 32px;
  width: 800px;
`

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  argTypes: {
    title: {
      defaultValue: 'Tooltip title',
    },
  },
} as Meta

export const Default: Story<TooltipProps> = (args) => {
  const [openState, setOpenState] = useState(false)

  const handleOpen = () => {
    setOpenState(true)
  }

  const handleClose = () => {
    setOpenState(false)
  }

  const referenceElement = useRef(null)

  return (
    <div style={{ margin: '3rem 10rem' }}>
      <Button
        ref={referenceElement}
        aria-describedby="tooltip"
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
      >
        Hover me!
      </Button>
      <Tooltip
        {...args}
        open={openState}
        id="tooltip"
        anchorEl={referenceElement.current}
      />
    </div>
  )
}

export const WithDisabledElements: Story<TooltipProps> = () => {
  const [openState, setOpenState] = useState(null)

  const handleOpen = (num: 1 | 2) => {
    setOpenState(num)
  }

  const handleClose = () => {
    setOpenState(null)
  }

  const referenceElementOne = useRef(null)
  const referenceElementTwo = useRef(null)

  return (
    <Body>
      <TextWrapper>
        <Typography variant="h3">Tooltip with disabled elements</Typography>
        <Typography variant="body_long">
          Firefox, Edge and Chrome supports tooltip on disabled elements. We
          found onPointerEnter and onPointerLeave was the best way to trigger
          events on disabled elements.
        </Typography>
        <Typography variant="body_long" style={{ marginTop: 8 }}>
          If you have Safari users, you will need to add inline style to your
          disabled element, shown in the example below, as well as wrapping the
          anchor inside a div which will handle the pointer event handlers. This
          will help trigger the mouse events correctly. Unfortunately, this
          workaround overwrites the &apos;not-allowed&apos; cursor.
        </Typography>
      </TextWrapper>
      <Wrapper>
        <Button
          disabled
          aria-describedby="tooltip-disabled-chrome"
          ref={referenceElementOne}
          onPointerEnter={() => handleOpen(1)}
          onPointerLeave={handleClose}
        >
          Disabled, but hover works!
        </Button>

        <Tooltip
          id="tooltip-disabled-chrome"
          open={openState === 1}
          title="Tooltip works!"
          anchorEl={referenceElementOne.current}
        />

        <div
          ref={referenceElementTwo}
          onPointerEnter={() => handleOpen(2)}
          onPointerLeave={handleClose}
          aria-describedby="tooltip-disabled-safari"
        >
          <Button disabled style={{ pointerEvents: 'none' }}>
            Just Safari example
          </Button>
        </div>

        <Tooltip
          id="tooltip-disabled-safari"
          open={openState === 2}
          title="Tooltip works!"
          anchorEl={referenceElementTwo.current}
        />
      </Wrapper>
    </Body>
  )
}

type Data = {
  number: string
  description: string
  origin: string
  price: number
}

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
  {
    number: '89-012',
    description: 'Pineapple',
    origin: 'Paraguay',
    price: 1.9,
  },
  {
    number: '89-012',
    description: 'Pomegranate',
    origin: 'Persia',
    price: 4.5,
  },
]

type Column = {
  name: string | React.ReactNode
  accessor: string
  sortDirection?: 'ascending' | 'descending' | 'none'
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

export const TableCellsWithTooltip: Story<TooltipProps> = () => {
  const cellValues = toCellValues(data, columns)
  const [state, setState] = useState<{
    openRow: number
    openCell: number
  }>({
    openRow: null,
    openCell: null,
  })

  const handleOpen = (openRow: number, openCell: number) => {
    setState({
      openRow,
      openCell,
    })
  }

  const handleClose = () => {
    setState({ openRow: null, openCell: null })
  }

  const { openRow, openCell } = state

  return (
    <Table>
      <Table.Caption>
        <Typography variant="h2">Fruits cost price</Typography>
      </Table.Caption>
      <Table.Head>
        <Table.Row>
          {columns.map((col) => (
            <Table.Cell key={`head-${col.accessor}`}>{col.name}</Table.Cell>
          ))}
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {cellValues?.map((row, rowIndex) => (
          <Table.Row key={row.toString()}>
            {row.map((cellValue, cellIndex) => {
              const createdRef = React.useRef(null)
              return (
                <Table.Cell key={cellValue}>
                  <span
                    ref={createdRef}
                    onMouseEnter={() => handleOpen(rowIndex, cellIndex)}
                    onMouseLeave={handleClose}
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                    }}
                  >
                    {cellValue}
                    <Tooltip
                      open={openRow === rowIndex && openCell === cellIndex}
                      placement="top"
                      title={cellValue}
                      anchorEl={createdRef.current}
                    />
                  </span>
                </Table.Cell>
              )
            })}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}
