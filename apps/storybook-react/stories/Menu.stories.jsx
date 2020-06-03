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
`

const Forced = styled.div.attrs({ tabIndex: 0 })`
  background: lightgrey;
  padding: 8px;
  width: min-content;
`

export default {
  title: 'Components|Menu',
  component: Menu,
  decorators: [withKnobs],
}

export const Preview = () => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const anchorRef = React.useRef()

  useEffect(() => setAnchorEl(anchorRef.current), [anchorRef.current])

  return (
    <Wrapper>
      <Typography variant="h4">Menu</Typography>
      <Forced id="anchor-test" ref={anchorRef}>
        Attached to some anchor
      </Forced>
      <Menu id="menu0" anchorEl={anchorEl} isopen>
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
        <MenuItem disabled>
          <MenuLabel>
            <Icon name="paste" />
          </MenuLabel>
          <MenuTitle variant="menu_title">Paste (disabled)</MenuTitle>
          <MenuLabel>CTRL+V</MenuLabel>
        </MenuItem>
        <MenuItem>
          <MenuLabel>
            <Icon name="edit" />
          </MenuLabel>
          <MenuTitle variant="menu_title">Rename</MenuTitle>
          <MenuLabel>CTRL+R</MenuLabel>
        </MenuItem>
        <MenuItem>
          <MenuLabel>
            <Icon name="delete_to_trash" />
          </MenuLabel>
          <MenuTitle variant="menu_title">Delete</MenuTitle>
          <MenuLabel>Del</MenuLabel>
        </MenuItem>
        <Divider variant="small" />
        <MenuItem>
          <MenuLabel>
            <Icon name="settings" />
          </MenuLabel>
          <MenuTitle variant="menu_title">Properties</MenuTitle>
        </MenuItem>
      </Menu>
    </Wrapper>
  )
}

export const ButtonToggle = () => {
  const [state, setState] = React.useState({ anchorEl: null, focus: null })
  const { anchorEl, focus } = state

  const toggleMenu = (e, focus = null) => {
    const updatedAnchorEl = anchorEl ? null : e.target
    setState({ ...state, anchorEl: updatedAnchorEl, focus })
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
        aria-haspopup="menu"
        aria-controls="menu1"
        aria-expanded={anchorEl ? 'true' : 'false'}
        onClick={toggleMenu}
        onKeyDown={onKeyPress}
      >
        Menu
      </Button>
      <Menu
        id="menu1"
        aria-labelledby="menuButton"
        anchorEl={anchorEl}
        focus={focus}
        isopen={anchorEl && true}
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

export const NestedMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const anchorRef = React.useRef()

  useEffect(() => setAnchorEl(anchorRef.current), [anchorRef.current])

  return (
    <Wrapper>
      <Typography variant="h4">Menu</Typography>
      <Forced id="anchor-test" ref={anchorRef}>
        Attached to some anchor
      </Forced>
      <Menu isopen={true}>
        <MenuItem>
          <MenuTitle variant="menu_title">Open</MenuTitle>
          <MenuLabel>
            <Icon name="arrow_drop_right" />
          </MenuLabel>
          <Menu>
            <MenuItem>
              <MenuTitle variant="menu_title">Paste</MenuTitle>
              <MenuLabel>
                <Icon name="arrow_drop_right" />
              </MenuLabel>
              <Menu>
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
            </MenuItem>
            <MenuItem>
              <MenuTitle variant="menu_title">Edit</MenuTitle>
              <MenuLabel>
                <Icon name="arrow_drop_right" />
              </MenuLabel>
              <Menu>
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
              </Menu>
            </MenuItem>
          </Menu>
        </MenuItem>
      </Menu>
    </Wrapper>
  )
}
