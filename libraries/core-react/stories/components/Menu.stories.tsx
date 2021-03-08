import React, { useState, useEffect, MutableRefObject } from 'react'
import { action } from '@storybook/addon-actions'
import styled from 'styled-components'
import { Menu, MenuProps, Typography, Button, Icon, TopBar } from '@components'
import { Story, Meta } from '@storybook/react'

import { tokens } from '@equinor/eds-tokens'

import {
  folder,
  copy,
  paste,
  edit,
  delete_to_trash,
  settings,
  arrow_drop_right,
  more_vertical,
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
  more_vertical,
  pressure,
  bearing,
  cable,
})
const { Item, Section } = Menu
const { Actions, Header } = TopBar
const { colors } = tokens

export default {
  title: 'Components/Menu',
  component: Menu,
  subcomponents: {
    Item,
    Section,
  },
  parameters: {
    viewMode: 'story',
  },
} as Meta

const Grid = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-auto-flow: column;
  width: auto;
  height: auto;
`

const onClick = (event: React.MouseEvent) => {
  action('clicked')(event)
  event.stopPropagation()
}

const bigMenuTemplate = (
  <>
    <Menu.Item onClick={onClick}>
      <Icon
        name="folder"
        size={16}
        color={colors.text.static_icons__tertiary.hex}
      />
      <Typography group="navigation" variant="menu_title" as="span">
        Open
      </Typography>
      <Typography
        color={colors.text.static_icons__tertiary.hex}
        group="navigation"
        variant="label"
        as="span"
      >
        CTRL+O
      </Typography>
    </Menu.Item>
    <Menu.Item active onClick={onClick}>
      <Icon
        name="copy"
        size={16}
        color={colors.text.static_icons__tertiary.hex}
      />
      <Typography group="navigation" variant="menu_title" as="span">
        Copy
      </Typography>
      <Typography
        color={colors.text.static_icons__tertiary.hex}
        group="navigation"
        variant="label"
        as="span"
      >
        CTRL+C
      </Typography>
    </Menu.Item>
    <Menu.Item disabled onClick={onClick}>
      <Icon
        name="paste"
        size={16}
        color={colors.text.static_icons__tertiary.hex}
      />
      <Typography group="navigation" variant="menu_title" as="span">
        Paste
      </Typography>
      <Typography
        color={colors.text.static_icons__tertiary.hex}
        group="navigation"
        variant="label"
        as="span"
      >
        CTRL+V
      </Typography>
    </Menu.Item>
    <Menu.Item onClick={onClick}>
      <Icon
        name="edit"
        size={16}
        color={colors.text.static_icons__tertiary.hex}
      />
      <Typography group="navigation" variant="menu_title" as="span">
        Rename
      </Typography>
      <Typography
        color={colors.text.static_icons__tertiary.hex}
        group="navigation"
        variant="label"
        as="span"
      >
        CTRL+R
      </Typography>
    </Menu.Item>
    <Menu.Item onClick={onClick}>
      <Icon
        name="delete_to_trash"
        size={16}
        color={colors.text.static_icons__tertiary.hex}
      />
      <Typography group="navigation" variant="menu_title" as="span">
        Delete
      </Typography>
      <Typography
        color={colors.text.static_icons__tertiary.hex}
        group="navigation"
        variant="label"
        as="span"
      >
        DEL
      </Typography>
    </Menu.Item>
    <Menu.Section title="Section">
      <Menu.Item onClick={onClick}>
        <Icon
          name="settings"
          size={16}
          color={colors.text.static_icons__tertiary.hex}
        />
        <Typography group="navigation" variant="menu_title" as="span">
          Settings
        </Typography>
      </Menu.Item>
    </Menu.Section>
  </>
)

export const ButtonToggle: Story<MenuProps> = () => {
  const [state, setState] = React.useState<{
    isOpen: boolean
    focus: 'first' | 'last'
  }>({
    focus: 'first',
    isOpen: false,
  })

  const { focus, isOpen } = state
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const openMenu = (focus: 'first' | 'last') => {
    setState({ ...state, isOpen: true, focus })
  }
  const closeMenu = () => setState({ ...state, isOpen: false })

  const onKeyPress = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const { key } = e
    e.preventDefault()
    switch (key) {
      case 'ArrowDown':
        isOpen ? closeMenu() : openMenu('first')
        break
      case 'ArrowUp':
        isOpen ? closeMenu() : openMenu('last')
        break
      case 'Escape':
        closeMenu()
        break
      default:
        break
    }
  }

  return (
    <Grid style={{ gridAutoFlow: 'row', position: 'relative', margin: '5rem' }}>
      <Typography variant="h4">Click button to open Menu</Typography>
      <Button
        ref={buttonRef}
        variant="ghost_icon"
        id="menuButton"
        aria-controls="menu-on-button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? closeMenu() : openMenu(null))}
        onKeyDown={onKeyPress}
      >
        Menu
      </Button>
      <Menu
        id="menu-on-button"
        aria-labelledby="menuButton"
        open={isOpen}
        anchorEl={buttonRef.current}
        onClose={() => closeMenu()}
        focus={focus}
        placement="right-end"
      >
        {bigMenuTemplate}
      </Menu>
    </Grid>
  )
}

export const InTopbar: Story<MenuProps> = () => {
  const [state, setState] = React.useState<{
    isOpen: boolean
    focus: 'first' | 'last'
  }>({
    focus: 'first',
    isOpen: false,
  })

  const { focus, isOpen } = state
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const openMenu = (focus: 'first' | 'last') => {
    setState({ ...state, isOpen: true, focus })
  }
  const closeMenu = () => setState({ ...state, isOpen: false })

  const onKeyPress = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const { key } = e
    e.preventDefault()
    switch (key) {
      case 'ArrowDown':
        isOpen ? closeMenu() : openMenu('first')
        break
      case 'ArrowUp':
        isOpen ? closeMenu() : openMenu('last')
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
            ref={buttonRef}
            variant="ghost_icon"
            id="menuButton"
            aria-controls="menu-on-button"
            aria-haspopup="true"
            aria-expanded={isOpen}
            onClick={() => (isOpen ? closeMenu() : openMenu(null))}
            onKeyDown={onKeyPress}
          >
            <Icon name="more_vertical" title="more" size={16}></Icon>
          </Button>
          <Menu
            id="menu-on-button"
            aria-labelledby="menuButton"
            focus={focus}
            open={isOpen}
            anchorEl={buttonRef.current}
            onClose={closeMenu}
            placement="left-end"
          >
            {bigMenuTemplate}
          </Menu>
        </Actions>
      </TopBar>
    </Grid>
  )
}

export const Examples: Story<MenuProps> = () => {
  const [state, setState] = useState<{
    open: 1 | 2 | 3 | 4 | null
  }>({
    open: null,
  })

  const oneRef = React.useRef<HTMLButtonElement>(null)
  const twoRef = React.useRef<HTMLButtonElement>(null)
  const threeRef = React.useRef<HTMLButtonElement>(null)
  const fourRef = React.useRef<HTMLButtonElement>(null)

  const { open } = state

  const openMenu = (open: 1 | 2 | 3 | 4) => {
    setState({ open })
  }

  const closeMenu = () => {
    setState({ open: null })
  }

  return (
    <Grid style={{ marginBottom: '3rem' }}>
      <Button
        ref={oneRef}
        id="anchor-iconbuttons"
        aria-controls="menu-iconbuttons"
        aria-haspopup="true"
        aria-expanded={open === 1}
        onClick={() => (open === 1 ? closeMenu() : openMenu(1))}
      >
        Icon Buttons
      </Button>
      <Menu
        onClose={closeMenu}
        id="menu-iconbuttons"
        open={open === 1}
        anchorEl={oneRef.current}
        placement="bottom"
      >
        <Button variant="ghost_icon" onClick={closeMenu}>
          <Icon name="save" title="save" size={16}></Icon>
        </Button>
        <Button variant="ghost_icon" onClick={closeMenu}>
          <Icon name="folder" title="folder" size={16}></Icon>
        </Button>
        <Button variant="ghost_icon" onClick={closeMenu}>
          <Icon name="edit" title="edit" size={16}></Icon>
        </Button>
        <Button variant="ghost_icon" onClick={closeMenu}>
          <Icon name="settings" title="settings" size={16}></Icon>
        </Button>
      </Menu>
      <Button
        ref={twoRef}
        id="anchor-plaintext"
        aria-controls="menu-plaintext"
        aria-haspopup="true"
        aria-expanded={open === 2}
        onClick={() => (open === 2 ? closeMenu() : openMenu(2))}
      >
        Text
      </Button>
      <Menu
        onClose={closeMenu}
        id="menu-plaintext"
        open={open === 2}
        anchorEl={twoRef.current}
        placement="bottom"
      >
        <Menu.Item onClick={onClick}>
          <Typography group="navigation" variant="menu_title" as="span">
            Pressure
          </Typography>
        </Menu.Item>
        <Menu.Item onClick={onClick}>
          <Typography group="navigation" variant="menu_title" as="span">
            Bearing
          </Typography>
        </Menu.Item>
        <Menu.Item onClick={onClick}>
          <Typography group="navigation" variant="menu_title" as="span">
            Cable
          </Typography>
        </Menu.Item>
      </Menu>
      <Button
        ref={threeRef}
        id="anchor-textIcon"
        aria-controls="menu-textIcon"
        aria-haspopup="true"
        aria-expanded={open === 3}
        onClick={() => (open === 3 ? closeMenu() : openMenu(3))}
      >
        Text with icons
      </Button>
      <Menu
        id="menu-textIcon"
        open={open === 3}
        anchorEl={threeRef.current}
        onClose={closeMenu}
        placement="bottom"
      >
        <Menu.Item onClick={onClick}>
          <Icon name="pressure" size={16} />
          <Typography group="navigation" variant="menu_title" as="span">
            Pressure
          </Typography>
        </Menu.Item>
        <Menu.Item onClick={onClick}>
          <Icon name="bearing" size={16} />
          <Typography group="navigation" variant="menu_title" as="span">
            Bearing
          </Typography>
        </Menu.Item>
        <Menu.Item onClick={onClick}>
          <Icon name="cable" size={16} />
          <Typography group="navigation" variant="menu_title" as="span">
            Cable
          </Typography>
        </Menu.Item>
      </Menu>
      <Button
        ref={fourRef}
        id="anchor-bigMenu"
        aria-controls="menu-bigMenu"
        aria-haspopup="true"
        aria-expanded={open === 4}
        onClick={() => (open === 4 ? closeMenu() : openMenu(4))}
      >
        Complex menu
      </Button>
      <Menu
        id="menu-bigMenu"
        anchorEl={fourRef.current}
        open={open === 4}
        onClose={closeMenu}
        placement="bottom"
      >
        {bigMenuTemplate}
      </Menu>
    </Grid>
  )
}
