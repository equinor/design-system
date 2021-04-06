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

const StoryCenter = styled.div({
  display: 'flex',
  justifyContent: 'center',
  margin: '2.5rem',
})

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
  const [isOpen, setIsOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>()

  const openTooltip = () => setIsOpen(true)
  const closeTooltip = () => setIsOpen(false)

  return (
    <StoryCenter>
      <Typography
        link
        href="#"
        ref={anchorRef}
        aria-describedby="tooltip"
        onMouseOver={openTooltip}
        onMouseLeave={closeTooltip}
        onFocus={openTooltip}
        onBlur={closeTooltip}
      >
        Hover me!
      </Typography>
      <Tooltip
        open={isOpen}
        id="tooltip"
        anchorEl={anchorRef.current}
        {...args}
      />
    </StoryCenter>
  )
}

export const WithDelay: Story<TooltipProps> = () => {
  const [isOpen, setIsOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>()
  let timer: number

  const openTooltip = () => {
    timer = setTimeout(() => {
      setIsOpen(true)
    }, 300)
  }

  const closeTooltip = () => {
    clearTimeout(timer)
    setIsOpen(false)
  }

  return (
    <StoryCenter>
      <Typography
        link
        href="#"
        ref={anchorRef}
        aria-describedby="tooltip-delay"
        onMouseOver={openTooltip}
        onMouseLeave={closeTooltip}
        onFocus={openTooltip}
        onBlur={closeTooltip}
      >
        Hover me!
      </Typography>
      <Tooltip
        open={isOpen}
        title="Tooltip title"
        id="tooltip-delay"
        anchorEl={anchorRef.current}
      />
    </StoryCenter>
  )
}

WithDelay.parameters = {
  docs: {
    storyDescription: 'Tooltip opening is delayed with `300ms`',
  },
}

export const Disabled: Story<TooltipProps> = () => {
  const [isOpen, setIsOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>()

  const openTooltip = () => setIsOpen(true)
  const closeTooltip = () => setIsOpen(false)

  return (
    <StoryCenter>
      <Button
        disabled
        variant="ghost_icon"
        aria-describedby="tooltip-disabled-chrome"
        ref={anchorRef}
        onPointerEnter={openTooltip}
        onPointerLeave={closeTooltip}
      >
        <Icon title="Chrome disabled button has Tooltip" data={chrome}></Icon>
      </Button>
      <Tooltip
        id="tooltip-disabled-chrome"
        open={isOpen}
        title="Disabled button, but hover works"
        anchorEl={anchorRef.current}
      />
    </StoryCenter>
  )
}
Disabled.parameters = {
  docs: {
    storyDescription:
      'Firefox, Edge and Chrome supports tooltip on disabled elements. We found onPointerEnter and onPointerLeave was the best way to trigger events on disabled elements.',
  },
}

export const DisabledInSafari: Story<TooltipProps> = () => {
  const [isOpen, setIsOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement>()

  const openTooltip = () => setIsOpen(true)
  const closeTooltip = () => setIsOpen(false)

  return (
    <StoryCenter>
      <div
        ref={anchorRef}
        onPointerEnter={openTooltip}
        onPointerLeave={closeTooltip}
        aria-describedby="tooltip-disabled-safari"
      >
        <Button disabled style={{ pointerEvents: 'none' }} variant="ghost_icon">
          <Icon
            title="Safari disabled button has Tooltip"
            data={explore}
          ></Icon>
        </Button>
      </div>

      <Tooltip
        id="tooltip-disabled-safari"
        open={isOpen}
        title="Disabled button, but hover works"
        anchorEl={anchorRef.current}
      />
    </StoryCenter>
  )
}

DisabledInSafari.parameters = {
  docs: {
    storyDescription:
      'If you have Safari users, you will need to add inline style to your disabled element, shown in the example below, as well as wrapping the anchor inside a div which will handle the pointer event handlers. This will help trigger the mouse events correctly. Unfortunately, this workaround overwrites the &apos;not-allowed&apos; cursor.',
  },
}

export const OnTableCells: Story<TooltipProps> = () => {
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
OnTableCells.parameters = {
  docs: {
    storyDescription: 'Example of how `Tooltip` can be used on `Table.Cell`',
  },
}
