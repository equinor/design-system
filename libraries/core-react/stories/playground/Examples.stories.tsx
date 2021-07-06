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
  display: grid;
  grid-template-columns: repeat(16, 1fr);
  grid-gap: 8px;
  grid-auto-columns: max-content;
  grid-auto-flow: column;
`

const Toolbar = styled.div`
  padding-top: 16px;
  display: grid;
  grid-gap: 8px;
  grid-column-start: 3;
  grid-column-end: span end;
  grid-auto-columns: max-content;
  grid-auto-flow: column;
`

const Sidebar = styled.div`
  padding-top: 16px;
  grid-column-start: 1;
  grid-column-end: 3;
  border-right: 1px solid rgba(247, 247, 247, 1);
`

export const Page: Story = (args) => {
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)
  const [isOpenSnackbar, setIsOpenSnackbar] = useState<boolean>(false)
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false)
  const [focus, setFocus] = useState<MenuProps['focus']>(null)
  const menuAnchorRef = useRef<HTMLButtonElement>(null)
  const popverAnchorRef = useRef<HTMLButtonElement>(null)

  const openMenu = (focus: MenuProps['focus']) => {
    setIsOpenMenu(true)
    setFocus(focus)
  }
  const closeMenu = () => {
    setIsOpenMenu(false)
    setFocus(null)
  }

  // This is just for storybook and changes done via controls addon
  useEffect(() => {
    setFocus(args.focus)
    setIsOpenMenu(args.open)
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
            ref={menuAnchorRef}
            id="anchor-menu"
            aria-haspopup="true"
            aria-expanded={isOpenMenu}
            aria-controls="menu"
            onClick={() => (isOpenMenu ? closeMenu() : openMenu(null))}
            onKeyDown={onKeyPress}
          >
            Show Menu
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
            <Menu.Item onClick={onClick}>Pressure</Menu.Item>
            <Menu.Item onClick={onClick}>Bearing</Menu.Item>
            <Menu.Item onClick={onClick}>Cable</Menu.Item>
          </Menu>
        </TopBar.Actions>
      </TopBar>
      <Content>
        <Sidebar>Sidebar</Sidebar>
        <Toolbar>
          <Button type="button" onClick={() => setIsOpenSnackbar(true)}>
            Show Snackbar
          </Button>
          <Snackbar
            open={isOpenSnackbar}
            onClose={() => setIsOpenSnackbar(false)}
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
            onClick={() => setIsPopoverOpen(true)}
          >
            Show Popover
          </Button>

          <Popover
            open={isPopoverOpen}
            id="popover"
            anchorEl={popverAnchorRef.current}
            onClose={() => setIsPopoverOpen(false)}
          >
            <Popover.Title>Title</Popover.Title>
            <Popover.Content>
              <Typography variant="body_short">Content</Typography>
            </Popover.Content>
            <Button onClick={() => setIsPopoverOpen(false)}>OK</Button>
          </Popover>
        </Toolbar>
      </Content>
    </Container>
  )
}
