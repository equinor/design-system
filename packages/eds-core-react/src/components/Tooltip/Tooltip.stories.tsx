import {
  Tooltip,
  TooltipProps,
  Typography,
  Button,
  Table,
  Icon,
  Checkbox,
  EdsProvider,
} from '../..'
import { data, columns, toCellValues } from '../../stories'
import { StoryFn, Meta } from '@storybook/react-vite'
import { explore } from '@equinor/eds-icons'
import { Stack } from './../../../.storybook/components'
import page from './Tooltip.docs.mdx'
import { useState } from 'react'

const meta: Meta<typeof Tooltip> = {
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
}

export default meta

export const Introduction: StoryFn<TooltipProps> = (args) => (
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

export const WithDelay: StoryFn<TooltipProps> = () => {
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

export const OnTableCells: StoryFn<TooltipProps> = () => {
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

export const LongListWithTooltips: StoryFn<TooltipProps> = () => {
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

export const RadioAndCheckboxes: StoryFn<TooltipProps> = () => (
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

export const TooltipOnButton: StoryFn<TooltipProps> = () => (
  <>
    <Tooltip title="This is what a tooltip looks like">
      <Button>Hover me</Button>
    </Tooltip>
    <Tooltip title="This tooltip only shows for people using mouse. Don't do this!">
      <Button disabled>Disabled button</Button>
    </Tooltip>
    <Tooltip title="Tooltip works with keyboard navigation when using aria-disabled">
      <Button aria-disabled>Aria-disabled button</Button>
    </Tooltip>
  </>
)
TooltipOnButton.storyName = 'Tooltip on disabled Button'

export const CustomRootElement: StoryFn<TooltipProps> = () => {
  const [element, setElement] = useState<null | HTMLElement>(null)

  return (
    <>
      <div ref={(el) => setElement(el)}>#root</div>
      <EdsProvider rootElement={element}>
        <Tooltip
          title={
            'This tooltip renders within the #root div, set from EdsProvider'
          }
        >
          <Icon data={explore} />
        </Tooltip>
      </EdsProvider>

      <Tooltip
        title={
          'This tooltip renders within the #root div, but from portalContainer prop'
        }
        portalContainer={element}
      >
        <Icon data={explore} />
      </Tooltip>
    </>
  )
}

CustomRootElement.storyName = `Custom portal element`
