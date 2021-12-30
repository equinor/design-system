import styled from 'styled-components'
import {
  Tooltip,
  TooltipProps,
  Typography,
  Button,
  Table,
  Icon,
  Checkbox,
} from '../..'
import { data, columns, toCellValues } from '../../stories'
import { Story, Meta } from '@storybook/react'

import { explore } from '@equinor/eds-icons'

const StoryCenter = styled.div({
  display: 'flex',
  justifyContent: 'center',
  margin: '2.5rem',
})

export default {
  title: 'Data Display/Tooltip',
  component: Tooltip,
} as Meta

export const Default: Story<TooltipProps> = (args) => (
  <StoryCenter>
    <Tooltip {...args}>
      <Button variant="ghost_icon">
        <Icon data={explore} title="explore"></Icon>
      </Button>
    </Tooltip>
  </StoryCenter>
)

Default.bind({})
Default.args = {
  title: 'Explore more actions',
}
export const WithDelay: Story<TooltipProps> = () => {
  return (
    <StoryCenter>
      <Tooltip enterDelay={300} title="Tooltip with delay">
        <Typography link href="#">
          Hover me!
        </Typography>
      </Tooltip>
    </StoryCenter>
  )
}
WithDelay.parameters = {
  docs: {
    description: {
      story: 'Tooltip opening is delayed with `300ms`',
    },
  },
}

// export const DisabledInSafari: Story<TooltipProps> = () => {
//   return (
//     <StoryCenter>
//       <Tooltip title="Disabled button, but hover works">
//         <span>
//           <Button
//             disabled
//             variant="ghost_icon"
//             style={{ pointerEvents: 'none' }}
//           >
//             <Icon data={explore}></Icon>
//           </Button>
//         </span>
//       </Tooltip>
//     </StoryCenter>
//   )
// }

// DisabledInSafari.parameters = {
//   docs: {
//     storyDescription:
//       'Chrome, Edge and Firefox all support mouse events on disabled elements. If you have Safari users, you will need to add inline style to your disabled element, shown in the example below, as well as wrapping the anchor inside a span. This will help trigger the mouse events correctly on disabled elements. Unfortunately, this workaround overwrites the &apos;not-allowed&apos; cursor.',
//   },
// }

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
    description: {
      story: 'Example of how `Tooltip` can be used on `Table.Cell`',
    },
  },
}

export const LonglistWithTooltips: Story<TooltipProps> = () => {
  const items = Array(100).fill(1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '200px' }}>
      {items.map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <span key={i}>
          <Tooltip title={`Icon ${i}`} placement="right">
            <Icon data={explore} />
          </Tooltip>
        </span>
      ))}
    </div>
  )
}
LonglistWithTooltips.parameters = {
  docs: {
    description: {
      story:
        'Long list of elements that have a tooltip. Used for testing if tooltip "lag" when scrolling while tooltips are visible',
    },
  },
}

export const radioAndCheckboxes: Story<TooltipProps> = () => (
  <>
    <Tooltip placement="top" title="tooltip on an input">
      <Checkbox label="Checkbox with tooltip" />
    </Tooltip>
    <br />
    <Tooltip title="Tooltip on a span around input">
      <span>
        <Checkbox label="Checkbox in span with tooltip" />
      </span>
    </Tooltip>
  </>
)
radioAndCheckboxes.parameters = {
  docs: {
    description: {
      story:
        'Inputs of type radio, checkbox and switch will have the tooltip applied to the input element. A good way to get the tooltip to also apply to the label is to simply wrap the input in a span',
    },
  },
}
