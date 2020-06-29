import React, { useEffect, useCallback } from 'react'
import { withKnobs, select, text, boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import styled from 'styled-components'
import {
  Menu,
  Typography,
  Button,
  Icon,
  Divider,
} from '@equinor/eds-core-react'
import {
  folder,
  copy,
  paste,
  edit,
  delete_to_trash,
  settings,
  arrow_drop_right,
} from '@equinor/eds-icons'

Icon.add({
  folder,
  copy,
  paste,
  edit,
  delete_to_trash,
  settings,
  arrow_drop_right,
})

const { MenuItem, MenuLabel, MenuTitle } = Menu
const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  width: auto;
  height: 500px;
  grid-gap: 32px;
  grid-template-columns: auto min-content;
  grid-template-rows: auto auto;
`

const Forced = styled.div.attrs({ tabIndex: 0 })`
  height: min-content;
  background: lightgrey;
  padding: 8px;
  width: min-content;
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
        <Forced
          id="anchor-topleft"
          aria-controls="menu-topleft"
          aria-haspopup="menu"
          ref={topLeftRef}
        >
          Top left
        </Forced>
        <Menu id="menu-topleft" open anchorEl={topLeft}>
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
        <Forced
          id="anchor-topright"
          aria-controls="menu-topright"
          aria-haspopup="menu"
          ref={topRightRef}
        >
          Top Right
        </Forced>
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
        <Forced
          id="anchor-bottomleft"
          aria-controls="menu-bottomleft"
          aria-haspopup="menu"
          ref={bottomLeftRef}
        >
          Bottom Left
        </Forced>
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
        <Forced
          id="anchor-bottomright"
          aria-controls="menu-bottomright"
          aria-haspopup="menu"
          ref={bottomRightRef}
        >
          Bottom right
        </Forced>
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
    openMenu: false,
    focus: null,
    buttonEl: null,
  })
  const { openMenu, focus, buttonEl } = state

  const toggleMenu = (e, focus = null) => {
    setState({ ...state, openMenu: !openMenu, focus, buttonEl: e.target })
  }

  const onKeyPress = (e) => {
    const { key } = e
    switch (key) {
      case 'ArrowDown':
      case 'Enter':
      case ' ':
        toggleMenu(e, 'first')
        break
      case 'ArrowUp':
        toggleMenu(e, 'last')
        break
      case 'Escape':
        toggleMenu({ target: null })
        break
      default:
        break
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', onKeyPress, false)

    return () => {
      document.removeEventListener('keydown', onKeyPress, false)
    }
  }, [])

  return (
    <Wrapper>
      <Typography variant="h4">Opened with Button</Typography>
      <Button
        variant="ghost_icon"
        id="menuButton"
        aria-controls="menu-on-button"
        aria-haspopup="menu"
        aria-expanded={openMenu}
        onClick={toggleMenu}
        onKeyDown={onKeyPress}
      >
        Menu
      </Button>
      <Menu
        id="menu-on-button"
        aria-labelledby="menuButton"
        focus={focus}
        open={openMenu}
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
    </Wrapper>
  )
}
