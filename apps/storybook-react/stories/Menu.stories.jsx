import React, { useEffect } from 'react'
import { withKnobs } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import styled from 'styled-components'
import {
  Menu,
  Typography,
  Button,
  Icon,
  Divider,
  TopBar,
} from '@equinor/eds-core-react'

import {
  folder,
  copy,
  paste,
  edit,
  delete_to_trash,
  settings,
  arrow_drop_right,
  more_verticle,
} from '@equinor/eds-icons'

Icon.add({
  folder,
  copy,
  paste,
  edit,
  delete_to_trash,
  settings,
  arrow_drop_right,
  more_verticle,
})

const { MenuItem, MenuLabel, MenuTitle } = Menu
const { Actions, Header } = TopBar

const Wrapper = styled.div`
  margin: 32px;
  width: auto;
  height: auto;
`

const Anchor = styled.div.attrs({ tabIndex: 0 })`
  background: lightgrey;
  padding: 14px;
  height: min-content;
  position: absolute;
`

export default {
  title: 'Components|Menu',
  component: Menu,
  decorators: [withKnobs],
}

export const Examples = () => {
  const [state, setState] = React.useState({
    topLeft: null,
    topRight: null,
    bottomLeft: null,
    bottomRight: null,
  })

  const topLeftRef = React.useRef()
  const topRightRef = React.useRef()
  const bottomLeftRef = React.useRef()
  const bottomRightRef = React.useRef()

  useEffect(() => {
    setState({
      topLeft: topLeftRef.current,
      topRight: topRightRef.current,
      bottomLeft: bottomLeftRef.current,
      bottomRight: bottomRightRef.current,
    })
  }, [state.topLeft])

  const { topLeft, topRight, bottomLeft, bottomRight } = state

  return (
    <Wrapper>
      <>
        <Anchor
          id="anchor-topleft"
          aria-controls="menu-topleft"
          aria-haspopup="menu"
          ref={topLeftRef}
          style={{ left: 0, top: 0 }}
        >
          Top left
        </Anchor>
        <Menu id="menu-topleft" open anchorEl={topLeft}>
          <MenuItem>
            <Typography group="navigation" variant="label">
              <Icon name="folder" />
            </Typography>
            <Typography group="navigation" variant="menu_title">
              Open
            </Typography>
            <Typography group="navigation" variant="label">
              CTRL+O
            </Typography>
          </MenuItem>
          <MenuItem active>
            <Typography group="navigation" variant="label">
              <Icon name="folder" />
            </Typography>
            <Typography group="navigation" variant="menu_title">
              active
            </Typography>
            <Typography group="navigation" variant="label">
              CTRL+O
            </Typography>
          </MenuItem>
          <MenuItem disabled>
            <Typography group="navigation" variant="label">
              <Icon name="folder" />
            </Typography>
            <Typography group="navigation" variant="menu_title">
              disabled
            </Typography>
            <Typography group="navigation" variant="label">
              CTRL+O
            </Typography>
          </MenuItem>
        </Menu>
      </>
      <>
        <Anchor
          id="anchor-topright"
          aria-controls="menu-topright"
          aria-haspopup="menu"
          ref={topRightRef}
          style={{ top: 0, right: 0 }}
        >
          Top Right
        </Anchor>
        <Menu id="menu-topright" open anchorEl={topRight}>
          <MenuItem>
            <MenuLabel>
              <Icon name="folder" />
            </MenuLabel>
            <MenuTitle variant="menu_title">Open</MenuTitle>
            <MenuLabel>CTRL+O</MenuLabel>
          </MenuItem>
          <MenuItem active>
            <MenuLabel>
              <Icon name="copy" />
            </MenuLabel>
            <MenuTitle>Copy (Active)</MenuTitle>
            <MenuLabel>CTRL+C</MenuLabel>
          </MenuItem>
        </Menu>
      </>
      <>
        <Anchor
          id="anchor-bottomleft"
          aria-controls="menu-bottomleft"
          aria-haspopup="menu"
          ref={bottomLeftRef}
          style={{ bottom: 0, left: 0 }}
        >
          Bottom Left
        </Anchor>
        <Menu id="menu-bottomleft" open anchorEl={bottomLeft}>
          <MenuItem>
            <MenuLabel>
              <Icon name="folder" />
            </MenuLabel>
            <MenuTitle variant="menu_title">Open</MenuTitle>
            <MenuLabel>CTRL+O</MenuLabel>
          </MenuItem>
          <MenuItem active>
            <MenuLabel>
              <Icon name="copy" />
            </MenuLabel>
            <MenuTitle>Copy (Active)</MenuTitle>
            <MenuLabel>CTRL+C</MenuLabel>
          </MenuItem>
        </Menu>
      </>
      <>
        <Anchor
          id="anchor-bottomright"
          aria-controls="menu-bottomright"
          aria-haspopup="menu"
          ref={bottomRightRef}
          style={{ bottom: 0, right: 0 }}
        >
          Bottom right
        </Anchor>
        <Menu id="menu-bottomright" open anchorEl={bottomRight}>
          <MenuItem>
            <MenuLabel>
              <Icon name="folder" />
            </MenuLabel>
            <MenuTitle variant="menu_title">Open</MenuTitle>
            <MenuLabel>CTRL+O</MenuLabel>
          </MenuItem>
          <MenuItem active>
            <MenuLabel>
              <Icon name="copy" />
            </MenuLabel>
            <MenuTitle>Copy (Active)</MenuTitle>
            <MenuLabel>CTRL+C</MenuLabel>
          </MenuItem>
        </Menu>
      </>
    </Wrapper>
  )
}

export const ButtonToggle = () => {
  const [state, setState] = React.useState({
    focus: 'first',
    buttonEl: null,
  })
  const onClick = action('onClick')

  const { buttonEl, focus } = state
  const isOpen = Boolean(buttonEl)

  const openMenu = (e, focus) => {
    setState({ ...state, buttonEl: e.target, focus })
  }

  const closeMenu = () => {
    setState({ ...state, buttonEl: null, focus })
  }

  const onKeyPress = (e) => {
    const { key } = e
    e.preventDefault()
    switch (key) {
      case 'ArrowDown':
        isOpen ? closeMenu() : openMenu(e, 'first')
        break
      case 'ArrowUp':
        isOpen ? closeMenu() : openMenu(e, 'last')
        break
      case 'Escape':
        closeMenu()
        break
      default:
        break
    }
  }

  return (
    <Wrapper>
      <Typography variant="h4">Opened with Button</Typography>
      <Button
        variant="ghost_icon"
        id="menuButton"
        aria-controls="menu-on-button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={(e) => (isOpen ? closeMenu() : openMenu(e))}
        onKeyDown={onKeyPress}
      >
        Menu
      </Button>
      <Menu
        id="menu-on-button"
        aria-labelledby="menuButton"
        open={isOpen}
        anchorEl={buttonEl}
        onClose={closeMenu}
        focus={focus}
      >
        <MenuItem onClick={onClick}>
          <Icon name="folder" />
          <span>Open</span>
          <span>CTRL+O</span>
        </MenuItem>
        <MenuItem active onClick={onClick}>
          <Icon name="copy" />
          <span>Copy</span>
          <span>CTRL+C</span>
        </MenuItem>
        <MenuItem disabled onClick={onClick}>
          <Icon name="paste" />
          <span>Paste</span>
          <span>CTRL+V</span>
        </MenuItem>
        <MenuItem onClick={onClick}>
          <Icon name="edit" />
          <span>Rename</span>
          <span>CTRL+R</span>
        </MenuItem>
        <MenuItem onClick={onClick}>
          <span>Delete</span>
          <Icon name="delete_to_trash" />
        </MenuItem>
        <Divider variant="small" />
        <MenuItem onClick={onClick}>
          <Icon name="settings" />
          <span>Properties</span>
        </MenuItem>
      </Menu>
    </Wrapper>
  )
}

export const InTopbar = () => {
  const [state, setState] = React.useState({
    focus: 'first',
    buttonEl: null,
  })

  const { focus, buttonEl } = state
  const isOpen = Boolean(buttonEl)

  const openMenu = (e) => setState({ ...state, buttonEl: e.target })

  const closeMenu = () => setState({ ...state, buttonEl: null })

  const onKeyPress = (e) => {
    const { key } = e
    switch (key) {
      case 'ArrowDown':
        isOpen ? closeMenu() : openMenu(e, 'first')
        break
      case 'ArrowUp':
        isOpen ? closeMenu() : openMenu(e, 'last')
        break
      case 'Escape':
        closeMenu()
        break
      default:
        break
    }
  }

  return (
    <Wrapper style={{ margin: 0 }}>
      <TopBar>
        <Header>Menu in Topbar</Header>
        <Actions>
          <Button
            variant="ghost_icon"
            id="menuButton"
            aria-controls="menu-on-button"
            aria-haspopup="menu"
            aria-expanded={Boolean(buttonEl)}
            onClick={(e) => (isOpen ? closeMenu() : openMenu(e))}
            onKeyDown={onKeyPress}
          >
            <Icon name="more_verticle" title="more"></Icon>
          </Button>
          <Menu
            id="menu-on-button"
            aria-labelledby="menuButton"
            focus={focus}
            open={Boolean(buttonEl)}
            anchorEl={buttonEl}
          >
            <MenuItem>
              <Icon name="folder" />
              <span>Open</span>
              <span>CTRL+O</span>
            </MenuItem>
            <MenuItem active>
              <Icon name="copy" />
              <span>Copy</span>
              <span>CTRL+C</span>
            </MenuItem>
            <MenuItem>
              <Icon name="paste" />
              <span>Paste</span>
              <span>CTRL+V</span>
            </MenuItem>
            <MenuItem>
              <Icon name="edit" />
              <span>Rename</span>
              <span>CTRL+R</span>
            </MenuItem>
            <MenuItem>
              <span>Delete</span>
              <Icon name="delete_to_trash" />
            </MenuItem>
            <Divider variant="small" />
            <MenuItem>
              <Icon name="settings" />
              <span>Properties</span>
            </MenuItem>
          </Menu>
        </Actions>
      </TopBar>
    </Wrapper>
  )
}

export const Custom = () => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const aRef = React.useRef()

  useEffect(() => {
    setAnchorEl(aRef.current)
  }, [anchorEl])

  return (
    <Wrapper>
      <>
        <Anchor
          id="anchor-topleft"
          aria-controls="menu-topleft"
          aria-haspopup="menu"
          ref={aRef}
        >
          Anchor
        </Anchor>
        <Menu id="menu-topleft" open anchorEl={anchorEl}>
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
      </>
    </Wrapper>
  )
}
