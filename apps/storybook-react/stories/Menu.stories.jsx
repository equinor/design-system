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
  pressure,
  bearing,
  cable,
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
  pressure,
  bearing,
  cable,
})

const { MenuItem, MenuSection } = Menu
const { Actions, Header } = TopBar
const { colors } = tokens

const Grid = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-auto-flow: column;
  width: auto;
  height: auto;
`

const Anchor = styled.div.attrs({ tabIndex: 0 })`
  background: lightgrey;
  padding: 14px;
  height: min-content;
  width: fit-content;
`

const FloatingAnchor = styled(Anchor)`
  position: absolute;
`

const onClick = action('onClick')

export default {
  title: 'Components|Menu',
  component: Menu,
  decorators: [withKnobs],
}

const simpleMenuTemplate = (
  <>
    <MenuSection title="Section title">
      <MenuItem>Item 1</MenuItem>
      <MenuItem>Item 2</MenuItem>
      <MenuItem>Item 3</MenuItem>
    </MenuSection>
  </>
)

const bigMenuTemplate = (
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
      <Typography
        color={colors.text.static_icons__tertiary.hex}
        group="navigation"
        variant="label"
      >
        <Icon name="delete_to_trash" />
      </Typography>
      <Typography group="navigation" variant="menu_title">
        Delete
      </Typography>
      <Typography
        color={colors.text.static_icons__tertiary.hex}
        group="navigation"
        variant="label"
      >
        DEL
      </Typography>
    </MenuItem>
    <MenuSection title="Section">
      <MenuItem onClick={onClick}>
        <Typography
          color={colors.text.static_icons__tertiary.hex}
          group="navigation"
          variant="label"
        >
          <Icon name="settings" />
        </Typography>
        <Typography group="navigation" variant="menu_title">
          Settings
        </Typography>
      </MenuItem>
    </MenuSection>
  </>
)

export const EdgeDetection = () => {
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
    <Grid>
      <FloatingAnchor
        id="anchor-topleft"
        aria-controls="menu-topleft"
        aria-haspopup="true"
        ref={topLeftRef}
        style={{ left: 0, top: 0 }}
      >
        Top left
      </FloatingAnchor>
      <Menu id="menu-topleft" open={Boolean(topLeft)} anchorEl={topLeft}>
        {simpleMenuTemplate}
      </Menu>

      <FloatingAnchor
        id="anchor-topright"
        aria-controls="menu-topright"
        aria-haspopup="true"
        ref={topRightRef}
        style={{ top: 0, right: 0 }}
      >
        Top Right
      </FloatingAnchor>
      <Menu id="menu-topright" open={Boolean(topRight)} anchorEl={topRight}>
        {simpleMenuTemplate}
      </Menu>

      <FloatingAnchor
        id="anchor-bottomleft"
        aria-controls="menu-bottomleft"
        aria-haspopup="true"
        ref={bottomLeftRef}
        style={{ bottom: 0, left: 0 }}
      >
        Bottom Left
      </FloatingAnchor>
      <Menu
        id="menu-bottomleft"
        open={Boolean(bottomLeft)}
        anchorEl={bottomLeft}
      >
        {simpleMenuTemplate}
      </Menu>

      <FloatingAnchor
        id="anchor-bottomright"
        aria-controls="menu-bottomright"
        aria-haspopup="true"
        ref={bottomRightRef}
        style={{ bottom: 0, right: 0 }}
      >
        Bottom right
      </FloatingAnchor>
      <Menu
        id="menu-bottomright"
        open={Boolean(bottomRight)}
        anchorEl={bottomRight}
      >
        {simpleMenuTemplate}
      </Menu>
    </Grid>
  )
}

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

  return (
    <Grid style={{ gridAutoFlow: 'row' }}>
      <Typography variant="h4">Opened with Button</Typography>
      <Button
        variant="ghost_icon"
        id="menuButton"
        aria-controls="menu-on-button"
        aria-haspopup="true"
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
        {bigMenuTemplate}
      </Menu>
    </Grid>
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
    <Grid style={{ margin: 0 }}>
      <TopBar>
        <Header>Menu in Topbar</Header>
        <Actions>
          <Button
            variant="ghost_icon"
            id="menuButton"
            aria-controls="menu-on-button"
            aria-haspopup="true"
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
            {bigMenuTemplate}
          </Menu>
        </Actions>
      </TopBar>
    </Grid>
  )
}

export const Examples = () => {
  const [state, setState] = React.useState({
    one: null,
    two: null,
    three: null,
    four: null,
  })

  const oneRef = React.useRef()
  const twoRef = React.useRef()
  const threeRef = React.useRef()
  const fourRef = React.useRef()

  useEffect(() => {
    setState({
      one: oneRef.current,
      two: twoRef.current,
      three: threeRef.current,
      four: fourRef.current,
    })
  }, [state.one])

  const { one, two, three, four } = state

  return (
    <Grid>
      <Anchor
        id="anchor-iconbuttons"
        aria-controls="menu-iconbuttons"
        aria-haspopup="true"
        ref={oneRef}
      >
        Icon Buttons
      </Anchor>
      <Menu id="menu-iconbuttons" open anchorEl={one}>
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
      <Anchor
        id="anchor-plaintext"
        aria-controls="menu-plaintext"
        aria-haspopup="true"
        ref={twoRef}
      >
        Text
      </Anchor>
      <Menu id="menu-plaintext" open anchorEl={two}>
        <MenuItem>Pressure </MenuItem>
        <MenuItem>Bearing</MenuItem>
        <MenuItem>Cable</MenuItem>
      </Menu>
      <Anchor
        id="anchor-textIcon"
        aria-controls="menu-textIcon"
        aria-haspopup="true"
        ref={threeRef}
      >
        Text with icons
      </Anchor>
      <Menu id="menu-textIcon" open anchorEl={three}>
        <MenuItem>
          <Typography group="navigation" variant="label">
            <Icon name="pressure" />
          </Typography>
          Pressure
        </MenuItem>
        <MenuItem>
          <Typography group="navigation" variant="label">
            <Icon name="bearing" />
          </Typography>
          Bearing
        </MenuItem>
        <MenuItem>
          <Typography group="navigation" variant="label">
            <Icon name="cable" />
          </Typography>
          Cable
        </MenuItem>
      </Menu>

      <Anchor
        id="anchor-bigMenu"
        aria-controls="menu-bigMenu"
        aria-haspopup="true"
        ref={fourRef}
      >
        Complex
      </Anchor>
      <Menu id="menu-bigMenu" open anchorEl={four}>
        {bigMenuTemplate}
      </Menu>
    </Grid>
  )
}
