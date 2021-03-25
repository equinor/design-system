import React, { useState } from 'react'
import { UseComboboxStateChange } from 'downshift'
import { action } from '@storybook/addon-actions'
import styled from 'styled-components'
import {
  Menu,
  MenuProps,
  Typography,
  Button,
  Icon,
  TopBar,
  SingleSelect,
} from '@components'
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

export const ComplexMenu: Story<MenuProps> = () => {
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
      case 'Enter':
        isOpen ? closeMenu() : openMenu('first')
        break
      case 'ArrowDown':
        isOpen ? closeMenu() : openMenu('first')
        break
      case 'ArrowUp':
        isOpen ? closeMenu() : openMenu('last')
        break
      default:
        break
    }
  }

  return (
    <Grid style={{ gridAutoFlow: 'row', marginBottom: '20rem' }}>
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
      case 'Enter':
        isOpen ? closeMenu() : openMenu('first')
        break
      case 'ArrowDown':
        isOpen ? closeMenu() : openMenu('first')
        break
      case 'ArrowUp':
        isOpen ? closeMenu() : openMenu('last')
        break
      default:
        break
    }
  }

  return (
    <Grid style={{ margin: 0, marginBottom: '20rem' }}>
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

export const IconButtons: Story<MenuProps> = () => {
  const [state, setState] = React.useState<{
    isOpen: boolean
    focus: 'first' | 'last'
  }>({
    focus: 'first',
    isOpen: false,
  })

  const { focus, isOpen } = state
  const ref = React.useRef<HTMLButtonElement>(null)

  const openMenu = (focus: 'first' | 'last') => {
    setState({ ...state, isOpen: true, focus })
  }
  const closeMenu = () => setState({ ...state, isOpen: false })
  const onKeyPress = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const { key } = e
    e.preventDefault()
    switch (key) {
      case 'Enter':
        isOpen ? closeMenu() : openMenu('first')
        break
      case 'ArrowDown':
        isOpen ? closeMenu() : openMenu('first')
        break
      case 'ArrowUp':
        isOpen ? closeMenu() : openMenu('last')
        break
      default:
        break
    }
  }

  return (
    <div style={{ margin: '3rem' }}>
      <Button
        ref={ref}
        id="anchor-iconbuttons"
        aria-controls="menu-iconbuttons"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? closeMenu() : openMenu(null))}
        onKeyDown={onKeyPress}
      >
        Icon Buttons
      </Button>
      <Menu
        onClose={closeMenu}
        id="menu-iconbuttons"
        open={isOpen}
        focus={focus}
        anchorEl={ref.current}
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
    </div>
  )
}

export const Text: Story<MenuProps> = () => {
  const [state, setState] = React.useState<{
    isOpen: boolean
    focus: 'first' | 'last'
  }>({
    focus: 'first',
    isOpen: false,
  })

  const { focus, isOpen } = state
  const ref = React.useRef<HTMLButtonElement>(null)

  const openMenu = (focus: 'first' | 'last') => {
    setState({ ...state, isOpen: true, focus })
  }
  const closeMenu = () => setState({ ...state, isOpen: false })
  const onKeyPress = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const { key } = e
    e.preventDefault()
    switch (key) {
      case 'Enter':
        isOpen ? closeMenu() : openMenu('first')
        break
      case 'ArrowDown':
        isOpen ? closeMenu() : openMenu('first')
        break
      case 'ArrowUp':
        isOpen ? closeMenu() : openMenu('last')
        break
      default:
        break
    }
  }

  return (
    <div style={{ margin: '3rem' }}>
      <Button
        ref={ref}
        id="anchor-plaintext"
        aria-controls="menu-plaintext"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? closeMenu() : openMenu(null))}
        onKeyDown={onKeyPress}
      >
        Text
      </Button>
      <Menu
        onClose={closeMenu}
        id="menu-plaintext"
        open={isOpen}
        focus={focus}
        anchorEl={ref.current}
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
    </div>
  )
}

export const TextWithIcons: Story<MenuProps> = () => {
  const [state, setState] = React.useState<{
    isOpen: boolean
    focus: 'first' | 'last'
  }>({
    focus: 'first',
    isOpen: false,
  })

  const { focus, isOpen } = state
  const ref = React.useRef<HTMLButtonElement>(null)

  const openMenu = (focus: 'first' | 'last') => {
    setState({ ...state, isOpen: true, focus })
  }
  const closeMenu = () => setState({ ...state, isOpen: false })
  const onKeyPress = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const { key } = e
    e.preventDefault()
    switch (key) {
      case 'Enter':
        isOpen ? closeMenu() : openMenu('first')
        break
      case 'ArrowDown':
        isOpen ? closeMenu() : openMenu('first')
        break
      case 'ArrowUp':
        isOpen ? closeMenu() : openMenu('last')
        break
      default:
        break
    }
  }

  return (
    <div style={{ margin: '3rem' }}>
      <Button
        ref={ref}
        id="anchor-textIcon"
        aria-controls="menu-textIcon"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? closeMenu() : openMenu(null))}
        onKeyDown={onKeyPress}
      >
        Text with icons
      </Button>
      <Menu
        id="menu-textIcon"
        open={isOpen}
        anchorEl={ref.current}
        onClose={closeMenu}
        focus={focus}
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
    </div>
  )
}

export const Placement: Story<MenuProps> = () => {
  const [placement, setPlacement] = useState<
    | 'auto'
    | 'auto-start'
    | 'auto-end'
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'left'
    | 'left-start'
    | 'left-end'
  >('auto')

  function handleChange(changes: UseComboboxStateChange<string>) {
    setPlacement(
      changes.selectedItem as
        | 'auto'
        | 'auto-start'
        | 'auto-end'
        | 'top'
        | 'top-start'
        | 'top-end'
        | 'bottom'
        | 'bottom-start'
        | 'bottom-end'
        | 'right'
        | 'right-start'
        | 'right-end'
        | 'left'
        | 'left-start'
        | 'left-end',
    )
  }

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
      case 'Enter':
        isOpen ? closeMenu() : openMenu('first')
        break
      case 'ArrowDown':
        isOpen ? closeMenu() : openMenu('first')
        break
      case 'ArrowUp':
        isOpen ? closeMenu() : openMenu('last')
        break
      default:
        break
    }
  }
  return (
    <Grid
      style={{
        gridAutoFlow: 'row',
        margin: '3rem',
      }}
    >
      <Typography variant="h4">
        Select a placement value to change Menu placement
      </Typography>
      <div
        style={{
          display: 'flex',
          width: 400,
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          margin: '50px 100px',
        }}
      >
        <SingleSelect
          label="placement"
          items={[
            'auto',
            'auto-start',
            'auto-end',
            'top',
            'top-start',
            'top-end',
            'bottom',
            'bottom-start',
            'bottom-end',
            'right',
            'right-start',
            'right-end',
            'left',
            'left-start',
            'left-end',
          ]}
          selectedOption={placement}
          handleSelectedItemChange={handleChange}
        />
        <Button
          ref={buttonRef}
          variant="ghost_icon"
          id="anchor-placement-menu"
          aria-controls="placement-menu"
          aria-haspopup="true"
          aria-expanded={isOpen}
          onClick={() => (isOpen ? closeMenu() : openMenu(null))}
          onKeyDown={onKeyPress}
        >
          Menu
        </Button>
        <Menu
          onClose={closeMenu}
          id="placement-menu"
          open={isOpen}
          focus={focus}
          anchorEl={buttonRef.current}
          placement={placement}
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
      </div>
    </Grid>
  )
}
