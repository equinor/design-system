import { useState, useEffect } from 'react'
import { action } from '@storybook/addon-actions'
import {
  Button,
  Density,
  EdsProvider,
  Group,
  GroupProps,
  Icon,
  Menu,
} from '../..'
import { Story, ComponentMeta } from '@storybook/react'
import { Stack } from './../../../.storybook/components'
import page from './Group.docs.mdx'

export default {
  title: 'Inputs/Group',
  component: Group,
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
      },
    },
  },
  decorators: [
    (Story) => (
      <Stack>
        <Story />
      </Stack>
    ),
  ],
} as ComponentMeta<typeof Group>

export const Introduction: Story<GroupProps> = (args) => {
  return (
    <Group aria-label="button group" {...args}>
      <Button>Contained</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="outlined">Outlined</Button>
    </Group>
  )
}

export const Vertical: Story<GroupProps> = () => (
  <Group aria-label="button group vertical" vertical>
    <Button>Contained</Button>
    <Button variant="outlined">Outlined</Button>
    <Button variant="outlined">Outlined</Button>
    <Button variant="outlined">Outlined</Button>
  </Group>
)

export const Split: Story<GroupProps> = () => {
  const options = ['Create task', 'Update task', 'Delete task']
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleMenuItemClick = (event: React.MouseEvent, index: number) => {
    action('click')(event)
    event.stopPropagation()
    setSelectedIndex(index)
  }

  const openMenu = () => {
    setIsOpen(true)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <Group aria-label="split button" style={{ gap: '1px' }}>
      <Button>{options[selectedIndex]}</Button>
      <Button
        ref={setAnchorEl}
        aria-label="select task action"
        aria-haspopup="true"
        aria-controls="menu-default"
        id="anchor-split"
        onClick={() => (isOpen ? closeMenu() : openMenu())}
        style={{ padding: '0 4px' }}
      >
        <Icon name="arrow_drop_down" title="arrow_down"></Icon>
      </Button>
      <Menu
        open={isOpen}
        id="menu-split"
        aria-labelledby="anchor-split"
        onClose={closeMenu}
        anchorEl={anchorEl}
      >
        {options.map((option, index) => (
          <Menu.Item
            key={option}
            disabled={index === 2}
            onClick={(event: React.MouseEvent) =>
              handleMenuItemClick(event, index)
            }
          >
            {option}
          </Menu.Item>
        ))}
      </Menu>
    </Group>
  )
}

export const Compact: Story<GroupProps> = () => {
  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    // Simulate user change
    setDensity('compact')
  }, [density])

  return (
    <EdsProvider density={density}>
      <Group aria-label="button group compact">
        <Button>Contained</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="outlined">Outlined</Button>
      </Group>
      <Group aria-label="button group compact" vertical>
        <Button>Contained</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="outlined">Outlined</Button>
      </Group>
    </EdsProvider>
  )
}
