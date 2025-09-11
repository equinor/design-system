import { useState, useEffect } from 'react'
import {
  Button,
  ButtonGroupProps,
  EdsProvider,
  Density,
  Icon,
  Menu,
} from '../../..'
import { arrow_drop_down } from '@equinor/eds-icons'
import { StoryFn, Meta } from '@storybook/react-vite'
import { action } from 'storybook/actions'
import { Stack } from './../../../../.storybook/components'
import page from './ButtonGroup.docs.mdx'

const meta: Meta<typeof Button.Group> = {
  title: 'Inputs/Button/Group',
  component: Button.Group,
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
}

export default meta

export const Introduction: StoryFn<ButtonGroupProps> = (args) => {
  return (
    <Button.Group {...args} aria-label="primary actions">
      <Button>Button</Button>
      <Button>Button</Button>
      <Button>Button</Button>
      <Button>Button</Button>
    </Button.Group>
  )
}

export const Horizontal: StoryFn<ButtonGroupProps> = () => (
  <Button.Group aria-label="primary actions">
    <Button>Button</Button>
    <Button>Button</Button>
    <Button>Button</Button>
    <Button>Button</Button>
  </Button.Group>
)

export const Vertical: StoryFn<ButtonGroupProps> = () => (
  <Button.Group aria-label="vertical actions" vertical>
    <Button>Button</Button>
    <Button>Button</Button>
    <Button>Button</Button>
    <Button>Button</Button>
  </Button.Group>
)

export const Split: StoryFn<ButtonGroupProps> = () => {
  const options = ['Create task', 'Update task', 'Delete task']
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
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
    <Button.Group aria-label="split buttons" style={{ gap: '1px' }}>
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
        <Icon data={arrow_drop_down} title="arrow_down"></Icon>
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
    </Button.Group>
  )
}

export const Compact: StoryFn<ButtonGroupProps> = () => {
  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    // Simulate user change
    setDensity('compact')
  }, [density])

  return (
    <EdsProvider density={density}>
      <Button.Group aria-label="compact actions">
        <Button>Button</Button>
        <Button>Button</Button>
        <Button>Button</Button>
        <Button>Button</Button>
      </Button.Group>
    </EdsProvider>
  )
}
