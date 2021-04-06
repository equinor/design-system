import React from 'react'
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

import { explore } from '@equinor/eds-icons'

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

export const Default: Story<TooltipProps> = (args) => (
  <StoryCenter>
    <Tooltip id="tooltip" {...args}>
      <Typography link href="#" aria-describedby="tooltip">
        Hover me!
      </Typography>
    </Tooltip>
  </StoryCenter>
)
// export const WithDelay: Story<TooltipProps> = () => {
//   const [isOpen, setIsOpen] = useState(false)
//   const anchorRef = useRef<HTMLButtonElement>()
//   let timer: number

//   const openTooltip = () => {
//     timer = setTimeout(() => {
//       setIsOpen(true)
//     }, 300)
//   }

//   const closeTooltip = () => {
//     clearTimeout(timer)
//     setIsOpen(false)
//   }

//   return (
//     <StoryCenter>
//       <Typography
//         link
//         href="#"
//         ref={anchorRef}
//         aria-describedby="tooltip-delay"
//         onMouseOver={openTooltip}
//         onMouseLeave={closeTooltip}
//         onFocus={openTooltip}
//         onBlur={closeTooltip}
//       >
//         Hover me!
//       </Typography>
//       <Tooltip
//         open={isOpen}
//         title="Tooltip title"
//         id="tooltip-delay"
//         anchorEl={anchorRef.current}
//       />
//     </StoryCenter>
//   )
// }

// WithDelay.parameters = {
//   docs: {
//     storyDescription: 'Tooltip opening is delayed with `300ms`',
//   },
// }

export const DisabledInSafari: Story<TooltipProps> = () => {
  return (
    <StoryCenter>
      <Tooltip
        id="tooltip-disabled-safari"
        title="Disabled button, but hover works"
      >
        <span>
          <Button
            disabled
            variant="ghost_icon"
            style={{ pointerEvents: 'none' }}
          >
            <Icon
              title="Safari disabled button has Tooltip"
              data={explore}
            ></Icon>
          </Button>
        </span>
      </Tooltip>
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
        {cellValues?.map((row) => (
          <Table.Row key={row.toString()}>
            {row.map((cellValue) => {
              return (
                <Tooltip
                  key={cellValue}
                  placement="top"
                  title={`Tooltip title for ` + cellValue}
                >
                  <Table.Cell key={cellValue}>{cellValue}</Table.Cell>
                </Tooltip>
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
