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

import { tokens } from '@equinor/eds-tokens'

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

const { MenuItem } = Menu
const { Actions, Header } = TopBar
const { colors } = tokens

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

const onClick = action('onClick')

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

  const menuDesktopExample = (
    <>
      <MenuItem>
        <Typography
          color={colors.text.static_icons__tertiary.hex}
          group="navigation"
          variant="label"
        >
          <Icon name="folder" />
        </Typography>
        <Typography group="navigation" variant="menu_title">
          Open
        </Typography>
        <Typography
          color={colors.text.static_icons__tertiary.hex}
          group="navigation"
          variant="label"
        >
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
    </>
  )

  return (
    <Wrapper>
      <Anchor
        id="anchor-topleft"
        aria-controls="menu-topleft"
        aria-haspopup="menu"
        ref={topLeftRef}
        style={{ left: 0, top: 0 }}
      >
        Top left
      </Anchor>
      <Menu id="menu-topleft" open={Boolean(topLeft)} anchorEl={topLeft}>
        {menuDesktopExample}
      </Menu>

      <Anchor
        id="anchor-topright"
        aria-controls="menu-topright"
        aria-haspopup="menu"
        ref={topRightRef}
        style={{ top: 0, right: 0 }}
      >
        Top Right
      </Anchor>
      <Menu id="menu-topright" open={Boolean(topRight)} anchorEl={topRight}>
        {menuDesktopExample}
      </Menu>

      <Anchor
        id="anchor-bottomleft"
        aria-controls="menu-bottomleft"
        aria-haspopup="menu"
        ref={bottomLeftRef}
        style={{ bottom: 0, left: 0 }}
      >
        Bottom Left
      </Anchor>
      <Menu
        id="menu-bottomleft"
        open={Boolean(bottomLeft)}
        anchorEl={bottomLeft}
      >
        {menuDesktopExample}
      </Menu>

      <Anchor
        id="anchor-bottomright"
        aria-controls="menu-bottomright"
        aria-haspopup="menu"
        ref={bottomRightRef}
        style={{ bottom: 0, right: 0 }}
      >
        Bottom right
      </Anchor>
      <Menu
        id="menu-bottomright"
        open={Boolean(bottomRight)}
        anchorEl={bottomRight}
      >
        {menuDesktopExample}
      </Menu>
    </Wrapper>
  )
}

const menuBig = (
  <>
    <MenuItem onClick={onClick}>
      <Typography
        color={colors.text.static_icons__tertiary.hex}
        group="navigation"
        variant="label"
      >
        <Icon name="folder" />
      </Typography>
      <Typography group="navigation" variant="menu_title">
        Open
      </Typography>
      <Typography
        color={colors.text.static_icons__tertiary.hex}
        group="navigation"
        variant="label"
      >
        CTRL+O
      </Typography>
    </MenuItem>
    <MenuItem active onClick={onClick}>
      <Typography
        color={colors.text.static_icons__tertiary.hex}
        group="navigation"
        variant="label"
      >
        <Icon name="copy" />
      </Typography>
      <Typography group="navigation" variant="menu_title">
        Copy
      </Typography>
      <Typography
        color={colors.text.static_icons__tertiary.hex}
        group="navigation"
        variant="label"
      >
        CTRL+C
      </Typography>
    </MenuItem>
    <MenuItem disabled onClick={onClick}>
      <Typography
        color={colors.text.static_icons__tertiary.hex}
        group="navigation"
        variant="label"
      >
        <Icon name="paste" />
      </Typography>
      <Typography group="navigation" variant="menu_title">
        Paste
      </Typography>
      <Typography
        color={colors.text.static_icons__tertiary.hex}
        group="navigation"
        variant="label"
      >
        CTRL+V
      </Typography>
    </MenuItem>
    <MenuItem onClick={onClick}>
      <Typography
        color={colors.text.static_icons__tertiary.hex}
        group="navigation"
        variant="label"
      >
        <Icon name="edit" />
      </Typography>
      <Typography group="navigation" variant="menu_title">
        Rename
      </Typography>
      <Typography
        color={colors.text.static_icons__tertiary.hex}
        group="navigation"
        variant="label"
      >
        CTRL+R
      </Typography>
    </MenuItem>
    <MenuItem onClick={onClick}>
      <Typography group="navigation" variant="menu_title">
        Delete
      </Typography>
      <Typography
        color={colors.text.static_icons__tertiary.hex}
        group="navigation"
        variant="label"
      >
        <Icon name="delete_to_trash" />
      </Typography>
    </MenuItem>
    <Divider variant="small" />
    <MenuItem onClick={onClick}>
      <Typography
        color={colors.text.static_icons__tertiary.hex}
        group="navigation"
        variant="label"
      >
        <Icon name="settings" />
      </Typography>
      <Typography group="navigation" variant="menu_title">
        Properties
      </Typography>
    </MenuItem>
  </>
)

export const ButtonToggle = () => {
  const [state, setState] = React.useState({
    focus: 'first',
    buttonEl: null,
  })

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
  console.log('isOpen', open)

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
        {menuBig}
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
            {menuBig}
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
