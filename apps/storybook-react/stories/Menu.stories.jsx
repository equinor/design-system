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
const { Actions, Header, CustomContent } = TopBar

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
    focus: null,
    buttonEl: null,
  })
  const { focus, buttonEl } = state

  const toggleMenu = (e, focus = null) => {
    setState({ ...state, focus, buttonEl: !buttonEl ? e.target : null })
  }

  const onKeyPress = (e) => {
    const { key } = e
    console.log('toggleMenu', key)

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

  const onGlobalKeyPress = (e) => {
    const { key } = e

    switch (key) {
      case 'Escape':
        toggleMenu({ target: null })
        break
      default:
        break
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', onGlobalKeyPress, false)

    return () => {
      document.removeEventListener('keydown', onGlobalKeyPress, false)
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
        aria-expanded={Boolean(buttonEl)}
        onClick={toggleMenu}
        onKeyDown={onKeyPress}
      >
        Menu
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
    </Wrapper>
  )
}

export const InTopbar = () => {
  const [state, setState] = React.useState({
    focus: null,
    buttonEl: null,
  })
  const { focus, buttonEl } = state

  const toggleMenu = (e, focus = null) => {
    setState({ ...state, focus, buttonEl: !buttonEl ? e.target : null })
  }

  const onKeyPress = (e) => {
    const { key } = e
    console.log('toggleMenu', key)

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

  const onGlobalKeyPress = (e) => {
    const { key } = e

    switch (key) {
      case 'Escape':
        toggleMenu({ target: null })
        break
      default:
        break
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', onGlobalKeyPress, false)

    return () => {
      document.removeEventListener('keydown', onGlobalKeyPress, false)
    }
  }, [])

  return (
    <Wrapper style={{ margin: 0 }}>
      <TopBar>
        <Header>Menu</Header>
        <Actions>
          <Button
            variant="ghost_icon"
            id="menuButton"
            aria-controls="menu-on-button"
            aria-haspopup="menu"
            aria-expanded={Boolean(buttonEl)}
            onClick={toggleMenu}
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
