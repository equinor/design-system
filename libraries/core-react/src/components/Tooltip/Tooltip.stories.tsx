import styled from 'styled-components'
import { Tooltip, TooltipProps, Typography, Button, Table, Icon } from '../..'
import { data, columns, toCellValues } from '../../stories'
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
      defaultValue: 'Explore more actions',
    },
  },
} as Meta

export const Default: Story<TooltipProps> = (args) => (
  <StoryCenter>
    <Tooltip {...args}>
      <Button variant="ghost_icon">
        <Icon data={explore}></Icon>
      </Button>
    </Tooltip>
  </StoryCenter>
)

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
    storyDescription: 'Tooltip opening is delayed with `300ms`',
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
    storyDescription:
      'Long list of elements that have a tooltip. Used for testing if tooltip "lag" when scrolling while tooltips are visible`',
  },
}
