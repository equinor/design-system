import React, { useEffect } from 'react'
import { action } from '@storybook/addon-actions'
import styled from 'styled-components'
import { Menu, MenuProps, Typography, Button, Icon } from '@components'
import { Story, Meta } from '@storybook/react'

import { tokens } from '@equinor/eds-tokens'

import {
  folder,
  copy,
  paste,
  edit,
  delete_to_trash,
  settings,
} from '@equinor/eds-icons'

const { colors } = tokens

export default {
  title: 'Components/Menu',
  component: Menu,
  subcomponents: {
    Item: Menu.Item,
    Section: Menu.Section,
  },
} as Meta

const StoryCenter = styled.div({
  display: 'flex',
  justifyContent: 'center',
  margin: '10rem',
})

const onClick = (event: React.MouseEvent) => {
  action('clicked')(event)
  event.stopPropagation()
}

export const Default: Story<MenuProps> = (args) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const [focus, setFocus] = React.useState<MenuProps['focus']>(null)
  const anchorRef = React.useRef<HTMLButtonElement>(null)

  const openMenu = (focus: MenuProps['focus']) => {
    setIsOpen(true)
    setFocus(focus)
  }
  const closeMenu = () => {
    setIsOpen(false)
    setFocus(null)
  }

  // This is just for storybook and changes done via controls addon
  useEffect(() => {
    setFocus(args.focus)
    setIsOpen(args.open)
  }, [args.open, args.focus])

  const onKeyPress = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const { key } = e
    e.preventDefault()
    e.stopPropagation()
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
    <StoryCenter>
      <Button
        ref={anchorRef}
        id="anchor-default"
        aria-controls="menu-default"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? closeMenu() : openMenu(null))}
        onKeyDown={onKeyPress}
      >
        Click to open Menu!
      </Button>
      <Menu
        open={isOpen}
        {...args}
        id="menu-default"
        focus={focus}
        onClose={closeMenu}
        anchorEl={anchorRef.current}
      >
        <Menu.Item onClick={onClick}>Pressure</Menu.Item>
        <Menu.Item onClick={onClick}>Bearing</Menu.Item>
        <Menu.Item onClick={onClick}>Cable</Menu.Item>
      </Menu>
    </StoryCenter>
  )
}

Default.bind({})
Default.args = {
  placement: 'bottom-end',
}

export const ComplexMenu: Story<MenuProps> = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const [focus, setFocus] = React.useState<'first' | 'last'>(null)
  const anchorRef = React.useRef<HTMLButtonElement>(null)

  const openMenu = (focus: 'first' | 'last') => {
    setIsOpen(true)
    setFocus(focus)
  }
  const closeMenu = () => {
    setIsOpen(false)
    setFocus(null)
  }

  const onKeyPress = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const { key } = e
    e.preventDefault()
    e.stopPropagation()
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
    <StoryCenter>
      <Button
        ref={anchorRef}
        id="anchor-complex"
        aria-controls="menu-complex"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? closeMenu() : openMenu(null))}
        onKeyDown={onKeyPress}
      >
        Click to open Menu!
      </Button>
      <Menu
        id="menu-complex"
        aria-labelledby="menuButton"
        open={isOpen}
        anchorEl={anchorRef.current}
        onClose={closeMenu}
        focus={focus}
        placement="right"
      >
        <Menu.Item onClick={onClick}>
          <Icon
            data={folder}
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
            data={copy}
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
            data={paste}
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
            data={edit}
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
            data={delete_to_trash}
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
              data={settings}
              size={16}
              color={colors.text.static_icons__tertiary.hex}
            />
            <Typography group="navigation" variant="menu_title" as="span">
              Settings
            </Typography>
          </Menu.Item>
        </Menu.Section>
      </Menu>
    </StoryCenter>
  )
}
