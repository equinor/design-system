import { useState, useRef, useEffect } from 'react'
import { Story, Meta } from '@storybook/react'
import styled from 'styled-components'
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
  Checkbox,
  EdsProvider,
  EdsProviderProps,
} from '../../src'
import { DataTable } from './DataTable'

import { accessible } from '@equinor/eds-icons'

export default {
  title: 'Playground/Examples',
  parameters: {
    viewMode: 'canvas',
  },
} as Meta

const Container = styled.div`
  display: grid;
  grid-template-rows: 64px auto;
  height: 100%;
`

const Content = styled.div`
  height: 100%;
  display: grid;
  grid-auto-columns: 200px max-content;
  grid-gap: 16px;
  grid-auto-flow: column;
`

const Toolbar = styled.div`
  padding-top: 16px;
  display: grid;
  grid-gap: 8px;
  grid-auto-columns: max-content;
  grid-auto-flow: column;
`

const Sidebar = styled.div`
  display: grid;
  height: 100%;
  padding-top: 16px;
  border-right: 1px solid
    var(--eds_ui_background__light, rgba(247, 247, 247, 1));
`
const Middle = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-auto-rows: max-content max-content;
`

export const TestPage: Story = (args) => {
  const [isOpenMenu, setOpenMenu] = useState<boolean>(false)
  const [isOpenSnackbar, setOpenSnackbar] = useState<boolean>(false)
  const [isPopoverOpen, setPopoverOpen] = useState<boolean>(false)
  const [focus, setFocus] = useState<MenuProps['focus']>(null)
  const [density, setDensity] =
    useState<EdsProviderProps['density']>('comfortable')
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
            <Icon data={accessible} title="Choose density" />
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
        <Sidebar>
          <Typography variant="h3">Sidebar</Typography>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li>
              <Checkbox label="Check me first" name="multiple" value="first" />
            </li>
            <li>
              <Checkbox
                label="Check me second"
                name="multiple"
                value="second"
              />
            </li>
            <li>
              <Checkbox label="Check me third" name="multiple" value="third" />
            </li>
          </ul>
        </Sidebar>
        <Middle>
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
            <Tooltip title="Tooltip!">
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
              <Popover.Header>
                <Popover.Title>Title</Popover.Title>
              </Popover.Header>
              <Popover.Content>
                <Typography variant="body_short">Content</Typography>
              </Popover.Content>
              <Popover.Actions>
                <Button onClick={() => setPopoverOpen(false)}>OK</Button>
              </Popover.Actions>
            </Popover>
          </Toolbar>
          <EdsProvider density={density}>
            <DataTable />
          </EdsProvider>
        </Middle>
      </Content>
    </Container>
  )
}
