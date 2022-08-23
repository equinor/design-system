import { useState, useEffect } from 'react'
import { action } from '@storybook/addon-actions'
import {
  Button,
  Density,
  EdsProvider,
  ButtonGroup,
  ButtonGroupProps,
  Icon,
  Menu,
} from '../..'
import { Story, ComponentMeta } from '@storybook/react'
import { Stack } from '../../../.storybook/components'
import page from './ButtonGroup.docs.mdx'

export default {
  title: 'Inputs/ButtonGroup',
  component: ButtonGroup,
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
} as ComponentMeta<typeof ButtonGroup>

export const Introduction: Story<ButtonGroupProps> = (args) => {
  return (
    <ButtonGroup aria-label="button group" {...args}>
      <Button>Contained</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="outlined">Outlined</Button>
    </ButtonGroup>
  )
}

export const Vertical: Story<ButtonGroupProps> = () => (
  <ButtonGroup aria-label="vertical" vertical>
    <Button>Contained</Button>
    <Button variant="outlined">Outlined</Button>
    <Button variant="outlined">Outlined</Button>
    <Button variant="outlined">Outlined</Button>
  </ButtonGroup>
)

export const Split: Story<ButtonGroupProps> = () => {
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
    <ButtonGroup aria-label="split button" style={{ gap: '1px' }}>
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
    </ButtonGroup>
  )
}

export const Compact: Story<ButtonGroupProps> = () => {
  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    // Simulate user change
    setDensity('compact')
  }, [density])

  return (
    <EdsProvider density={density}>
      <ButtonGroup aria-label="button group compact">
        <Button>Contained</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="outlined">Outlined</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="vertical button group compact" vertical>
        <Button>Contained</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="outlined">Outlined</Button>
      </ButtonGroup>
    </EdsProvider>
  )
}
