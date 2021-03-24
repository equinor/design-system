import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import {
  Tooltip,
  TooltipProps,
  Typography,
  Button,
  Table,
  Icon,
} from '@components'
import { data, columns } from './helpers/data'
import { toCellValues } from './helpers/toCellValues'
import { Story, Meta } from '@storybook/react'

import { chrome, explore } from '@equinor/eds-icons'

const icons = {
  chrome,
  explore,
}

Icon.add(icons)

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
      defaultValue: 'This is the tooltip title',
    },
  },
} as Meta

export const Default: Story<TooltipProps> = (args) => {
  const [openState, setOpenState] = useState(false)

  let timer: ReturnType<typeof setTimeout>

  const handleOpen = () => {
    timer = setTimeout(() => {
      setOpenState(true)
    }, 300)
  }

  const handleClose = () => {
    clearTimeout(timer)
    setOpenState(false)
  }

  const referenceElement = useRef(null)

  return (
    <div style={{ margin: '3rem 10rem' }}>
      <Typography
        link
        href="#"
        ref={referenceElement}
        aria-describedby="tooltip"
        onMouseOver={handleOpen}
        onMouseLeave={handleClose}
        onFocus={handleOpen}
        onBlur={handleClose}
      >
        Hover me!
      </Typography>
      <Tooltip
        open={openState}
        id="tooltip"
        anchorEl={referenceElement.current}
        {...args}
      />
    </div>
  )
}

export const WithDisabledElements: Story<TooltipProps> = () => {
  const [openState, setOpenState] = useState(null)

  let timer: ReturnType<typeof setTimeout>

  const handleOpen = (num: 1 | 2) => {
    timer = setTimeout(() => {
      setOpenState(num)
    }, 300)
  }

  const handleClose = () => {
    clearTimeout(timer)
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
          variant="ghost_icon"
          aria-describedby="tooltip-disabled-chrome"
          ref={referenceElementOne}
          onPointerEnter={() => handleOpen(1)}
          onPointerLeave={handleClose}
        >
          <Icon title="Chrome disabled button has Tooltip" name="chrome"></Icon>
        </Button>

        <Tooltip
          id="tooltip-disabled-chrome"
          open={openState === 1}
          title="Disabled button, but hover works"
          anchorEl={referenceElementOne.current}
        />

        <div
          ref={referenceElementTwo}
          onPointerEnter={() => handleOpen(2)}
          onPointerLeave={handleClose}
          aria-describedby="tooltip-disabled-safari"
        >
          <Button
            disabled
            style={{ pointerEvents: 'none' }}
            variant="ghost_icon"
          >
            <Icon
              title="Safari disabled button has Tooltip"
              name="explore"
            ></Icon>
          </Button>
        </div>

        <Tooltip
          id="tooltip-disabled-safari"
          open={openState === 2}
          title="Disabled button, but hover works"
          anchorEl={referenceElementTwo.current}
        />
      </Wrapper>
    </Body>
  )
}

export const TableCellsWithTooltip: Story<TooltipProps> = () => {
  const cellValues = toCellValues(data, columns)
  const [state, setState] = useState<{
    openRow: number
    openCell: number
  }>({
    openRow: null,
    openCell: null,
  })

  let timer: ReturnType<typeof setTimeout>

  const handleOpen = (openRow: number, openCell: number) => {
    timer = setTimeout(() => {
      setState({
        openRow,
        openCell,
      })
    }, 300)
  }

  const handleClose = () => {
    clearTimeout(timer)
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
                    onMouseOver={() => handleOpen(rowIndex, cellIndex)}
                    onMouseLeave={handleClose}
                    onFocus={() => handleOpen(rowIndex, cellIndex)}
                    onBlur={handleClose}
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                    }}
                  >
                    {cellValue}
                    <Tooltip
                      open={openRow === rowIndex && openCell === cellIndex}
                      placement="top"
                      title={`Tooltip title for ` + cellValue}
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
