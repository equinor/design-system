import { useState, useRef, useEffect } from 'react'
import { Story, Meta } from '@storybook/react'
import styled from 'styled-components'
import { action } from '@storybook/addon-actions'
import {
  Typography,
  Icon,
  Button,
  Menu,
  MenuProps,
  TopBar,
  Snackbar,
  Tooltip,
  Popover,
} from '../../src'
import * as TableExamples from './DataTable.stories'

import { accessible } from '@equinor/eds-icons'

export default {
  title: 'Playground/Examples',
} as Meta

const onClick = (event: React.MouseEvent) => {
  action('clicked')(event)
  event.stopPropagation()
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 64px auto;
  height: 100%;
`

const Content = styled.div`
  margin: 0 16px;
  height: 100%;
  display: grid;
  grid-auto-rows: max-content max-content;
  grid-gap: 16px;
`

const Toolbar = styled.div`
  padding-top: 16px;
  display: grid;
  grid-gap: 8px;
  grid-auto-columns: max-content;
  grid-auto-flow: column;
`

export const DefaultPage: Story = (args) => {
  const [isOpenMenu, setOpenMenu] = useState<boolean>(false)
  const [isOpenSnackbar, setOpenSnackbar] = useState<boolean>(false)
  const [isPopoverOpen, setPopoverOpen] = useState<boolean>(false)
  const [focus, setFocus] = useState<MenuProps['focus']>(null)
  const [density, setDensity] = useState<'comfortable' | 'compact'>('compact')
  const menuAnchorRef = useRef<HTMLButtonElement>(null)
  const popverAnchorRef = useRef<HTMLButtonElement>(null)

  const openMenu = (focus: MenuProps['focus']) => {
    setOpenMenu(true)
    setFocus(focus)
  }
  const closeMenu = () => {
    setOpenMenu(false)
    setFocus(null)
  }

  // This is just for storybook and changes done via controls addon
  useEffect(() => {
    setFocus(args.focus)
    setOpenMenu(args.open)
    // eslint-disable-next-line react/destructuring-assignment
  }, [args.open, args.focus])

  const onKeyPress = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const { key } = e
    e.preventDefault()
    e.stopPropagation()
    switch (key) {
      case 'Enter':
        isOpenMenu ? closeMenu() : openMenu('first')
        break
      case 'ArrowDown':
        isOpenMenu ? closeMenu() : openMenu('first')
        break
      case 'ArrowUp':
        isOpenMenu ? closeMenu() : openMenu('last')
        break
      default:
        break
    }
  }

  return (
    <Container>
      <TopBar>
        <TopBar.Header>
          <Icon name="grid_on" size={16} />
          Examples page
        </TopBar.Header>

        <TopBar.Actions>
          <Button
            variant="ghost_icon"
            ref={menuAnchorRef}
            id="anchor-menu"
            aria-haspopup="true"
            aria-expanded={isOpenMenu}
            aria-controls="menu"
            onClick={() => (isOpenMenu ? closeMenu() : openMenu(null))}
            onKeyDown={onKeyPress}
          >
            <Icon data={accessible} />
          </Button>
          <Menu
            open={isOpenMenu}
            {...args}
            id="menu"
            focus={focus}
            aria-labelledby="anchor-menu"
            onClose={closeMenu}
            anchorEl={menuAnchorRef.current}
          >
            <Menu.Item onClick={() => setDensity('comfortable')}>
              Comfortable
            </Menu.Item>
            <Menu.Item onClick={() => setDensity('compact')}>Compact</Menu.Item>
          </Menu>
        </TopBar.Actions>
      </TopBar>
      <Content>
        <Toolbar>
          <Button type="button" onClick={() => setOpenSnackbar(true)}>
            Show Snackbar
          </Button>
          <Snackbar
            open={isOpenSnackbar}
            onClose={() => setOpenSnackbar(false)}
            autoHideDuration={5000}
          >
            Message goes here
          </Snackbar>
          <Tooltip title="Tooltip!" placement="top">
            <Button>Show Tooltip</Button>
          </Tooltip>

          <Button
            aria-haspopup
            aria-controls="popover"
            aria-expanded={isPopoverOpen}
            ref={popverAnchorRef}
            onClick={() => setPopoverOpen(true)}
          >
            Show Popover
          </Button>

          <Popover
            open={isPopoverOpen}
            id="popover"
            anchorEl={popverAnchorRef.current}
            onClose={() => setPopoverOpen(false)}
          >
            <Popover.Title>Title</Popover.Title>
            <Popover.Content>
              <Typography variant="body_short">Content</Typography>
            </Popover.Content>
            <Button onClick={() => setPopoverOpen(false)}>OK</Button>
          </Popover>
        </Toolbar>
        <TableExamples.CompactDataGrid density={density} />
      </Content>
    </Container>
  )
}
