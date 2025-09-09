import { useState, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { tokens } from '@equinor/eds-tokens'
import {
  more_vertical,
  place,
  calendar_date_range,
  file_description,
  label,
} from '@equinor/eds-icons'
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
import { StoryFn, Meta } from '@storybook/react-vite'
import page from './SideSheet.docs.mdx'

const icons = {
  more_vertical,
  place,
  calendar_date_range,
  file_description,
  label,
}

Icon.add(icons)

const meta: Meta<typeof SideSheet> = {
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
        type: 'code',
      },
    },
  },
}

export default meta

const {
  colors: {
    interactive: {
      primary__resting: { rgba: primaryColor },
    },
  },
} = tokens

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

export const Introduction: StoryFn<SideSheetProps> = (args) => {
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

export const Placement: StoryFn<SideSheetProps> = () => {
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
            aria-labelledby="date-range-slider"
            value={[getUnixTime('1980'), getUnixTime('2000')]}
            outputFunction={outputFunction}
          />
        </div>
      </SideSheet>
    </>
  )
}

export const Scrollable: StoryFn<SideSheetProps> = () => {
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

export const Draggable: StoryFn<SideSheetProps> = () => {
  const [toggle, setToggle] = useState(true)

  const DragTarget = styled.div<{ $dragging: boolean }>(({ $dragging }) => {
    return css`
      --primary: ${primaryColor};
      position: absolute;
      height: 100%;
      width: 12px;
      left: -6px;
      top: 0;
      cursor: ${$dragging ? 'col-resize' : 'default'};
      &::after {
        transition: background-color 150ms ease;
        transition-delay: 150ms;
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        width: 4px;
        transform: translateX(-50%);
        height: 100%;
        background-color: ${$dragging ? 'var(--primary)' : 'transparent'};
      }
      &:hover {
        cursor: col-resize;
        &::after {
          transition-delay: 200ms;
          background-color: var(--primary);
        }
      }
    `
  })

  const [maxWidth, setMaxWidth] = useState(0)
  const containerRef = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      setMaxWidth(node.getBoundingClientRect().width - 20)
    }
  }, [])

  const minWidth = 200
  const [width, setWidth] = useState(300)
  const [isDragging, setIsDragging] = useState(false)
  let pointerX: number
  let throttling = false

  const startDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()

    pointerX = e.clientX
    setIsDragging(true)
    window.addEventListener('mouseup', stopDrag, { once: true })
    window.addEventListener('mousemove', handleDrag)
  }

  const handleDrag = (e: MouseEvent) => {
    if (throttling) return
    throttling = true
    setTimeout(() => (throttling = false), 32)
    e.preventDefault()

    const deltaX = pointerX - e.clientX
    setWidth((prevWidth) => {
      const newWidth = prevWidth + deltaX
      if (newWidth < minWidth) {
        return minWidth
      }
      if (newWidth > maxWidth) {
        return maxWidth
      }
      return newWidth
    })
    pointerX = e.clientX
  }

  const stopDrag = () => {
    window.removeEventListener('mousemove', handleDrag)
    setIsDragging(false)
  }

  return (
    <div ref={containerRef} style={{ height: '450px', isolation: 'isolate' }}>
      <Button
        variant="outlined"
        onClick={() => setToggle(!toggle)}
        style={{ float: 'right' }}
      >
        Filters
      </Button>

      <SideSheet
        open={toggle}
        onClose={() => setToggle(!toggle)}
        width={`${width}px`}
      >
        <DragTarget onMouseDown={startDrag} $dragging={isDragging} />
        <div style={{ padding: '0 8px' }}>
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
          <Slider min={0} max={100} aria-label="slider" value={[20, 70]} />
        </div>
      </SideSheet>
    </div>
  )
}
