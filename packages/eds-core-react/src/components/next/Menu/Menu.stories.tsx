import { useRef, useState } from 'react'
import type { Meta, StoryFn } from '@storybook/react-vite'
import { Menu, type MenuProps } from '.'
import { Button } from '../Button'
import { Icon } from '../Icon'
import {
  info_circle,
  settings,
  log_out,
  copy,
  paste,
  delete_to_trash,
} from '@equinor/eds-icons'

const meta: Meta<typeof Menu> = {
  title: 'EDS 2.0 (beta)/Menu',
  component: Menu,
  tags: ['beta'],
  parameters: {
    docs: {
      description: {
        component: `
⚠️ **Beta Component** - This component is under active development.

\`\`\`tsx
import { Menu } from '@equinor/eds-core-react/next'
\`\`\`
        `,
      },
    },
  },
}

export default meta

export const Introduction: StoryFn<MenuProps> = () => {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Button ref={anchorRef} onClick={() => setOpen((prev) => !prev)}>
        Open Menu
      </Button>
      <Menu
        open={open}
        anchorEl={anchorRef.current}
        onClose={() => setOpen(false)}
      >
        <Menu.Item>
          <Icon data={info_circle} size="sm" />
          Information
        </Menu.Item>
        <Menu.Item>
          <Icon data={settings} size="sm" />
          Settings
        </Menu.Item>
        <Menu.Item>
          <Icon data={log_out} size="sm" />
          Log out
        </Menu.Item>
      </Menu>
    </>
  )
}

export const WithSections: StoryFn<MenuProps> = () => {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Button ref={anchorRef} onClick={() => setOpen((prev) => !prev)}>
        Open Menu
      </Button>
      <Menu
        open={open}
        anchorEl={anchorRef.current}
        onClose={() => setOpen(false)}
      >
        <Menu.Section title="Edit">
          <Menu.Item>
            <Icon data={copy} size="sm" />
            Copy
          </Menu.Item>
          <Menu.Item>
            <Icon data={paste} size="sm" />
            Paste
          </Menu.Item>
        </Menu.Section>
        <Menu.Section title="Danger zone">
          <Menu.Item>
            <Icon data={delete_to_trash} size="sm" />
            Delete
          </Menu.Item>
        </Menu.Section>
      </Menu>
    </>
  )
}

export const WithoutIcons: StoryFn<MenuProps> = () => {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Button ref={anchorRef} onClick={() => setOpen((prev) => !prev)}>
        Open Menu
      </Button>
      <Menu
        open={open}
        anchorEl={anchorRef.current}
        onClose={() => setOpen(false)}
      >
        <Menu.Item>Label</Menu.Item>
        <Menu.Item>Label</Menu.Item>
        <Menu.Item>Label</Menu.Item>
        <Menu.Item>Label</Menu.Item>
        <Menu.Item>Label</Menu.Item>
        <Menu.Item>Label</Menu.Item>
      </Menu>
    </>
  )
}

export const WithDisabledItems: StoryFn<MenuProps> = () => {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Button ref={anchorRef} onClick={() => setOpen((prev) => !prev)}>
        Open Menu
      </Button>
      <Menu
        open={open}
        anchorEl={anchorRef.current}
        onClose={() => setOpen(false)}
      >
        <Menu.Item>
          <Icon data={info_circle} size="sm" />
          Information
        </Menu.Item>
        <Menu.Item disabled>
          <Icon data={settings} size="sm" />
          Settings (disabled)
        </Menu.Item>
        <Menu.Item>
          <Icon data={log_out} size="sm" />
          Log out
        </Menu.Item>
      </Menu>
    </>
  )
}

export const WithActiveItem: StoryFn<MenuProps> = () => {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Button ref={anchorRef} onClick={() => setOpen((prev) => !prev)}>
        Open Menu
      </Button>
      <Menu
        open={open}
        anchorEl={anchorRef.current}
        onClose={() => setOpen(false)}
      >
        <Menu.Item>Item 1</Menu.Item>
        <Menu.Item active>Item 2 (active)</Menu.Item>
        <Menu.Item>Item 3</Menu.Item>
      </Menu>
    </>
  )
}
