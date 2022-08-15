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
import { Story, ComponentMeta } from '@storybook/react'
import { explore } from '@equinor/eds-icons'
import { Stack } from './../../../.storybook/components'
import page from './Tooltip.docs.mdx'

export default {
  title: 'Data Display/Tooltip',
  component: Tooltip,
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <Stack>
          <Story />
        </Stack>
      )
    },
  ],
} as ComponentMeta<typeof Tooltip>

export const Introduction: Story<TooltipProps> = (args) => (
  <Tooltip {...args}>
    <Button variant="ghost_icon">
      <Icon data={explore} title="explore"></Icon>
    </Button>
  </Tooltip>
)
Introduction.bind({})
Introduction.args = {
  title: 'Explore more actions',
}

export const WithDelay: Story<TooltipProps> = () => {
  return (
    <Tooltip enterDelay={300} title="Tooltip with delay">
      <Typography link href="#">
        Hover me!
      </Typography>
    </Tooltip>
  )
}
WithDelay.storyName = 'With delay'

// export const DisabledInSafari: Story<TooltipProps> = () => {
//   return (
//     <Stack>
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
//     </Stack>
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
OnTableCells.storyName = 'On table cells'

export const LongListWithTooltips: Story<TooltipProps> = () => {
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
LongListWithTooltips.storyName = 'Long list with toolstips'

export const RadioAndCheckboxes: Story<TooltipProps> = () => (
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
RadioAndCheckboxes.storyName = 'Radio and checkboxes'
