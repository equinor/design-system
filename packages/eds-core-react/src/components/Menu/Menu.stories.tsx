import { useEffect, useState } from 'react'
import { action } from '@storybook/addon-actions'
import {
  Menu,
  MenuProps,
  Typography,
  Button,
  Icon,
  EdsProvider,
  Density,
} from '../..'
import { Story, ComponentMeta } from '@storybook/react'
import { Stack } from './../../../.storybook/components'
import page from './Menu.docs.mdx'

import { tokens } from '@equinor/eds-tokens'

import {
  folder,
  copy,
  paste,
  edit,
  delete_to_trash,
  settings,
  thumb_pin,
} from '@equinor/eds-icons'

const { colors } = tokens

export default {
  title: 'Navigation/Menu',
  component: Menu,
  subcomponents: {
    Item: Menu.Item,
    Section: Menu.Section,
  },
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
        type: 'code',
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <Stack>
          <Story />
        </Stack>
      )
    },
  ],
} as ComponentMeta<typeof Menu>

const onClick = (event: React.MouseEvent) => {
  action('clicked')(event)
  event.stopPropagation()
}

export const Introduction: Story<MenuProps> = (args) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>(null)

  const openMenu = () => {
    setIsOpen(true)
  }
  const closeMenu = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react/destructuring-assignment
    setIsOpen(args.open)
    // eslint-disable-next-line react/destructuring-assignment
  }, [args.open])

  return (
    <>
      <Button
        ref={setAnchorEl}
        id="anchor-default"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls="menu-default"
        onClick={() => (isOpen ? closeMenu() : openMenu())}
      >
        Click to open Menu!
      </Button>
      <Menu
        open={isOpen}
        {...args}
        id="menu-default"
        aria-labelledby="anchor-default"
        onClose={closeMenu}
        anchorEl={anchorEl}
      >
        <Menu.Item onClick={onClick}>Pressure</Menu.Item>
        <Menu.Item onClick={onClick}>Bearing</Menu.Item>
        <Menu.Item onClick={onClick}>Cable</Menu.Item>
      </Menu>
    </>
  )
}
Introduction.bind({})
Introduction.args = {
  placement: 'bottom-end',
}

export const Complex: Story<MenuProps> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>(null)

  const openMenu = () => {
    setIsOpen(true)
  }
  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <>
      <Button
        ref={setAnchorEl}
        id="anchor-complex"
        aria-controls="menu-complex"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? closeMenu() : openMenu())}
      >
        Click to open Menu!
      </Button>

      <Menu
        id="menu-complex"
        aria-labelledby="anchor-complex"
        open={isOpen}
        anchorEl={anchorEl}
        onClose={closeMenu}
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
    </>
  )
}

export const Compact: Story<MenuProps> = () => {
  const [density, setDensity] = useState<Density>('comfortable')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>(null)

  const openMenu = () => {
    setIsOpen(true)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    // Simulate user change
    setDensity('compact')
  }, [density])

  return (
    <EdsProvider density={density}>
      <Button
        ref={setAnchorEl}
        id="anchor-compact"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls="menu-compact"
        onClick={() => (isOpen ? closeMenu() : openMenu())}
      >
        Click to open Menu!
      </Button>
      <EdsProvider density="compact">
        <Menu
          open={isOpen}
          id="menu-compact"
          aria-labelledby="anchor-compact"
          onClose={closeMenu}
          anchorEl={anchorEl}
        >
          <Menu.Item onClick={onClick}>Pressure</Menu.Item>
          <Menu.Item onClick={onClick}>Bearing</Menu.Item>
          <Menu.Item onClick={onClick}>Cable</Menu.Item>
        </Menu>
      </EdsProvider>
    </EdsProvider>
  )
}

export const StaysOpen: Story<MenuProps> = (args) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>(null)

  const openMenu = () => {
    setIsOpen(true)
  }
  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <>
      <Button
        ref={setAnchorEl}
        id="anchor-default"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls="menu-default"
        onClick={() => (isOpen ? closeMenu() : openMenu())}
      >
        Open Menu
      </Button>
      <Menu
        open={isOpen}
        {...args}
        id="menu-default"
        aria-labelledby="anchor-default"
        onClose={closeMenu}
        anchorEl={anchorEl}
      >
        <Menu.Item
          closeMenuOnClick={false}
          style={{ backgroundColor: 'lightgrey' }}
        >
          <Icon
            data={thumb_pin}
            size={16}
            color={colors.text.static_icons__tertiary.hex}
          />
          <Typography group="navigation" variant="menu_title" as="span">
            Menu Headline
          </Typography>
        </Menu.Item>
        <Menu.Item onClick={onClick}>Menu item 1</Menu.Item>
        <Menu.Item onClick={onClick}>Menu item 2</Menu.Item>
        <Menu.Item onClick={onClick}>Menu item 3</Menu.Item>
        <Menu.Item
          closeMenuOnClick={false}
          style={{ backgroundColor: 'lightgrey' }}
        >
          <Icon
            data={thumb_pin}
            size={16}
            color={colors.text.static_icons__tertiary.hex}
          />
          <Typography group="navigation" variant="menu_title" as="span">
            Menu Headline 2
          </Typography>
        </Menu.Item>
        <Menu.Item onClick={onClick}>Menu item 1</Menu.Item>
        <Menu.Item onClick={onClick}>Menu item 2</Menu.Item>
      </Menu>
    </>
  )
}
StaysOpen.bind({})
StaysOpen.args = {
  placement: 'bottom-end',
}
