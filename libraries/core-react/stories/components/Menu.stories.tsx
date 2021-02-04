import React, { useEffect } from 'react'
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

const { colors } = tokens

export default {
  title: 'Components/Menu',
  component: Menu,
  parameters: {
    docs: {
      description: {
        component: `A menu, also known as a dropdown, is a temporary list of actions or functions.`,
      },
    },
    viewMode: 'story',
  },
  subcomponents: { Item: Menu.Item, Section: Menu.Section },
} as Meta

const Wrapper = styled.div`
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
  //  Note: This example is not interactive, as Storybook
  // doesn't yet support to manipulate subcomponents via Storybook Args
  const [state, setState] = React.useState<{
    buttonEl: HTMLButtonElement
    focus: 'first' | 'last'
  }>({
    focus: 'first',
    buttonEl: null,
  })

  const { buttonEl, focus } = state
  const isOpen = Boolean(buttonEl)

  const openMenu = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLButtonElement>,
    focus: 'first' | 'last',
  ) => {
    const target = e.target as HTMLButtonElement
    setState({ ...state, buttonEl: target, focus })
  }

  const closeMenu = () => {
    setState({ ...state, buttonEl: null, focus })
  }

  const onKeyPress = (e: React.KeyboardEvent<HTMLButtonElement>) => {
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
    <Wrapper style={{ gridAutoFlow: 'row' }}>
      <Typography variant="h4">Click button to open Menu</Typography>
      <Button
        variant="ghost_icon"
        id="menuButton"
        aria-controls="menu-on-button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={(e) => (isOpen ? closeMenu() : openMenu(e, null))}
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
            group="navigation"
            variant="label"
            as="span"
            color={colors.text.static_icons__tertiary.hex}
          >
            DEL
          </Typography>
        </Menu.Item>
        <Menu.Section title="Section">
          <Menu.Item onClick={onClick}>
            <Icon name="settings" size={16} />
            <Typography group="navigation" variant="menu_title" as="span">
              Settings
            </Typography>
          </Menu.Item>
        </Menu.Section>
      </Menu>
    </Wrapper>
  )
}

export const InTopbar: Story<MenuProps> = () => {
  const [state, setState] = React.useState<{
    buttonEl: HTMLButtonElement
    focus: 'first' | 'last'
  }>({
    focus: 'first',
    buttonEl: null,
  })

  const { focus, buttonEl } = state
  const isOpen = Boolean(buttonEl)

  const openMenu = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    const target = e.target as HTMLButtonElement
    setState({ ...state, buttonEl: target })
  }

  const closeMenu = () => setState({ ...state, buttonEl: null })

  const onKeyPress = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const { key } = e
    switch (key) {
      case 'ArrowDown':
        isOpen ? closeMenu() : openMenu(e)
        break
      case 'ArrowUp':
        isOpen ? closeMenu() : openMenu(e)
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
        <TopBar.Header>Menu in Topbar</TopBar.Header>
        <TopBar.Actions>
          <Button
            variant="ghost_icon"
            id="menuButton"
            aria-controls="menu-on-button"
            aria-haspopup="true"
            aria-expanded={Boolean(buttonEl)}
            onClick={(e) => (isOpen ? closeMenu() : openMenu(e))}
            onKeyDown={onKeyPress}
          >
            <Icon name="more_vertical" title="more" size={16}></Icon>
          </Button>
          <Menu
            id="menu-on-button"
            aria-labelledby="menuButton"
            focus={focus}
            open={Boolean(buttonEl)}
            anchorEl={buttonEl}
            onClose={closeMenu}
          >
            {bigMenuTemplate}
          </Menu>
        </TopBar.Actions>
      </TopBar>
    </Wrapper>
  )
}

export const Examples: Story<MenuProps> = () => {
  const [state, setState] = React.useState<{
    one: HTMLDivElement
    two: HTMLDivElement
    three: HTMLDivElement
    four: HTMLDivElement
  }>({
    one: null,
    two: null,
    three: null,
    four: null,
  })

  const oneRef = React.useRef<HTMLDivElement>(null)
  const twoRef = React.useRef<HTMLDivElement>(null)
  const threeRef = React.useRef<HTMLDivElement>(null)
  const fourRef = React.useRef<HTMLDivElement>(null)

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
    <Wrapper>
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
          <Icon name="save" title="save" size={16}></Icon>
        </Button>
        <Button variant="ghost_icon">
          <Icon name="folder" title="folder" size={16}></Icon>
        </Button>
        <Button variant="ghost_icon">
          <Icon name="edit" title="edit" size={16}></Icon>
        </Button>
        <Button variant="ghost_icon">
          <Icon name="settings" title="settings" size={16}></Icon>
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
        <Menu.Item>
          <Typography group="navigation" variant="menu_title" as="span">
            Pressure
          </Typography>
        </Menu.Item>
        <Menu.Item>
          <Typography group="navigation" variant="menu_title" as="span">
            Bearing
          </Typography>
        </Menu.Item>
        <Menu.Item>
          <Typography group="navigation" variant="menu_title" as="span">
            Cable
          </Typography>
        </Menu.Item>
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
        <Menu.Item>
          <Icon name="pressure" size={16} />
          <Typography group="navigation" variant="menu_title" as="span">
            Pressure
          </Typography>
        </Menu.Item>
        <Menu.Item>
          <Icon name="bearing" size={16} />
          <Typography group="navigation" variant="menu_title" as="span">
            Bearing
          </Typography>
        </Menu.Item>
        <Menu.Item>
          <Icon name="cable" size={16} />
          <Typography group="navigation" variant="menu_title" as="span">
            Cable
          </Typography>
        </Menu.Item>
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
    </Wrapper>
  )
}
