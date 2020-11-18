import React, { useState, useRef } from 'react'
import {
  Tooltip,
  TopBar,
  Scrim,
  Popover,
  Menu,
  Search,
  Chip,
  Button,
  Icon,
  Dialog,
  Snackbar,
  Typography,
  SideSheet,
  List,
} from '@equinor/eds-core-react'
import {
  save,
  folder,
  copy,
  paste,
  edit,
  delete_to_trash,
  settings,
  arrow_drop_right,
  more_verticle,
  pressure,
  bearing,
  cable,
} from '@equinor/eds-icons'
import { Story, Meta } from '@storybook/react'
import styled from 'styled-components'

const { Header } = TopBar
const { Title, CustomContent, Actions } = Dialog
const { PopoverTitle, PopoverContent, PopoverAnchor } = Popover
const { ListItem } = List

Icon.add({
  save,
  folder,
  copy,
  paste,
  edit,
  delete_to_trash,
  settings,
  arrow_drop_right,
  more_verticle,
  pressure,
  bearing,
  cable,
})

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

export const zIndex: Story<any> = () => {
  // const [triggerAll, setTriggerAll] = useState(false)

  // const menuAnchorRef = useRef<HTMLDivElement>(null)

  return (
    <Body>
      <Typography variant="h1">Z-index values</Typography>
      <Typography>
        The CSS property z-index is used in a few of our components to layer
        content in a third axis. These values can be overridden, but such
        customization is discouraged as far as it's possible. The chosen
        priority is made to avoid unexpected collisions.
      </Typography>
      {/* <Button onClick={() => setTriggerAll(true)}>
        Preview all components
      </Button> */}
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
      {/* 
      {triggerAll && (
        <Body>
          <TopBar>
            <Header>TopBar z-index: </Header>
          </TopBar>

          <Snackbar open>Snackbar z-index: 400</Snackbar>
          <Scrim>
            <Dialog>
              <Title>Scrim</Title>
              <CustomContent>Z-index:</CustomContent>
              <Actions>
                <Button variant="ghost" onClick={() => setTriggerAll(false)}>
                  Cancel preview
                </Button>
              </Actions>
            </Dialog>
          </Scrim>
          <Popover open>
            <PopoverAnchor>
              <Button variant="ghost">Popover anchor</Button>
            </PopoverAnchor>
            <PopoverTitle>Popover</PopoverTitle>
            <PopoverContent>
              <Typography variant="body_short">Z-index:</Typography>
              <Tooltip title="Tooltip" open>
                <Chip>Chip </Chip>
              </Tooltip>
            </PopoverContent>
          </Popover>
          <div
            id="anchor"
            aria-controls="menu-iconbuttons"
            aria-haspopup="true"
            ref={menuAnchorRef}
          >
            Menu anchor
          </div>
          <Menu id="menu-iconbuttons" open anchorEl={menuAnchorRef.current}>
            <Button variant="ghost_icon">
              <Icon name="save" title="save"></Icon>
            </Button>
            <Button variant="ghost_icon">
              <Icon name="folder" title="folder"></Icon>
            </Button>
            <Button variant="ghost_icon">
              <Icon name="edit" title="edit"></Icon>
            </Button>
            <Button variant="ghost_icon">
              <Icon name="settings" title="settings"></Icon>
            </Button>
          </Menu>
          <SideSheet variant="large" title="Sidesheet" open>
            <Typography>This is a sidesheet</Typography>
          </SideSheet>
        </Body>
      )} */}
    </Body>
  )
}
