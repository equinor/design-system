import React from 'react'
import { Typography, List } from '@equinor/eds-core-react'
import { Story, Meta } from '@storybook/react'
import styled from 'styled-components'

const { ListItem } = List

export default {
  title: 'Documentation/Z-Index',
  parameters: {
    viewMode: 'story',
  },
} as Meta

const Body = styled.div`
  display: grid;
  grid-row-gap: 16px;
  padding: 4rem 20px;
`

export const zIndex: Story = () => (
  <Body>
    <Typography variant="h1">Z-index values</Typography>
    <Typography>
      The CSS property z-index is used in a few of our components to layer
      content in a third axis. These values can be overridden, but such
      customization is discouraged as far as it's possible. The chosen priority
      is made to avoid unexpected collisions.
    </Typography>
    <List variant="numbered">
      <ListItem>
        <Typography>Snackbar: 400</Typography>
      </ListItem>
      <ListItem>
        <Typography>Tooltip: 350 </Typography>
      </ListItem>
      <ListItem>
        <Typography>Scrim: 300</Typography>
      </ListItem>
      <ListItem>
        <Typography>Topbar: 250</Typography>
      </ListItem>
      <ListItem>
        <Typography>Sidesheet: 200</Typography>
      </ListItem>
      <ListItem>
        <Typography>Menu: 150</Typography>
      </ListItem>
      <ListItem>
        <Typography>Popover: 100</Typography>
      </ListItem>
      <ListItem>
        <Typography>Chip: 10</Typography>
      </ListItem>
    </List>
  </Body>
)
