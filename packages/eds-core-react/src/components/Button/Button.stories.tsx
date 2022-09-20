import { useState, useEffect } from 'react'
import { action } from '@storybook/addon-actions'
import {
  Button,
  ButtonProps,
  ButtonGroupProps,
  ToggleButtonProps,
  Icon,
  EdsProvider,
  Density,
  Menu,
  Progress,
} from '../..'
import { Story, ComponentMeta } from '@storybook/react'
import { menu, add, save, edit, copy } from '@equinor/eds-icons'
import { Stack } from './../../../.storybook/components'
import page from './Button.docs.mdx'

export default {
  title: 'Inputs/Button',
  component: Button,
  subcomponents: {
    Group: Button.Group,
    Toggle: Button.Toggle,
  },
  args: {
    as: 'button',
  },
  argTypes: {
    as: {
      options: ['span', 'a', 'button'],
      control: {
        type: 'select',
      },
    },
  },
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
      },
    },
  },
} as ComponentMeta<typeof Button>

export const Introduction: Story<ButtonProps> = (args) => {
  return <Button {...args}>You can control me</Button>
}
Introduction.decorators = [
  (Story) => (
    <Stack>
      <Story />
    </Stack>
  ),
]

export const Basic: Story<ButtonProps> = () => (
  <>
    <Button>Contained</Button>
    <Button variant="contained_icon" aria-label="add action">
      <Icon data={add}></Icon>
    </Button>
    <Button variant="outlined">Outlined</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="ghost_icon" aria-label="save action">
      <Icon data={save}></Icon>
    </Button>
  </>
)
Basic.decorators = [
  (Story) => (
    <Stack>
      <Story />
    </Stack>
  ),
]

export const IconButton: Story<ButtonProps> = () => (
  <>
    <Button variant="ghost_icon" aria-label="save action">
      <Icon data={save}></Icon>
    </Button>
    <Button variant="ghost_icon" color="secondary" aria-label="save action">
      <Icon data={save}></Icon>
    </Button>
    <Button variant="ghost_icon" color="danger" aria-label="save action">
      <Icon data={save}></Icon>
    </Button>
    <Button variant="ghost_icon" disabled aria-label="save action">
      <Icon data={save}></Icon>
    </Button>
    <Button variant="contained_icon" aria-label="add action">
      <Icon data={add}></Icon>
    </Button>
    <Button variant="contained_icon" color="secondary" aria-label="add action">
      <Icon data={add}></Icon>
    </Button>
    <Button variant="contained_icon" color="danger" aria-label="add action">
      <Icon data={add}></Icon>
    </Button>
    <Button variant="contained_icon" disabled aria-label="add action">
      <Icon data={add}></Icon>
    </Button>
  </>
)

IconButton.storyName = 'Icon button'
IconButton.decorators = [
  (Story) => (
    <Stack>
      <Story />
    </Stack>
  ),
]

export const Color: Story<ButtonProps> = () => (
  <>
    <Button color="primary">Primary</Button>
    <Button color="secondary">Secondary</Button>
    <Button color="danger">Danger</Button>
  </>
)
Color.decorators = [
  (Story) => (
    <Stack>
      <Story />
    </Stack>
  ),
]

export const Hierarchy: Story<ButtonProps> = () => (
  <>
    <Button>Contained</Button>
    <Button variant="outlined">Outlined</Button>
    <Button variant="ghost">Ghost</Button>
  </>
)
Hierarchy.decorators = [
  (Story) => (
    <Stack>
      <Story />
    </Stack>
  ),
]

export const FileUpload: Story<ButtonProps> = () => (
  <label htmlFor="file-upload">
    <input type="file" id="file-upload" style={{ display: 'none' }} multiple />
    <Button as="span">Upload file</Button>
  </label>
)
FileUpload.storyName = 'File upload'
FileUpload.decorators = [
  (Story) => (
    <Stack>
      <Story />
    </Stack>
  ),
]

export const ProgressButton: Story<ButtonProps> = () => (
  <>
    <Button>
      <Progress.Dots />
    </Button>
    <Button variant="ghost_icon">
      <Progress.Dots color="primary" />
    </Button>
    <Button>
      <Progress.Circular size={16} color="neutral" />
    </Button>
    <Button variant="ghost_icon">
      <Progress.Circular size={16} color="primary" />
    </Button>
  </>
)
ProgressButton.storyName = 'Progress button'
ProgressButton.decorators = [
  (Story) => (
    <Stack>
      <Story />
    </Stack>
  ),
]

export const All: Story<ButtonProps> = () => (
  <>
    <Button>Primary</Button>
    <Button color="secondary">Secondary</Button>
    <Button color="danger">Danger</Button>
    <Button disabled>Disabled</Button>
    <Button variant="outlined">Primary</Button>
    <Button variant="outlined" color="secondary">
      Secondary
    </Button>
    <Button variant="outlined" color="danger">
      Danger
    </Button>
    <Button variant="outlined" disabled>
      Disabled
    </Button>
    <Button variant="ghost">Primary</Button>
    <Button variant="ghost" color="secondary">
      Secondary
    </Button>
    <Button variant="ghost" color="danger">
      Danger
    </Button>
    <Button variant="ghost" disabled>
      Disabled
    </Button>
    <Button variant="ghost_icon" aria-label="save action">
      <Icon name="save" title="save action"></Icon>
    </Button>
    <Button variant="ghost_icon" color="secondary" aria-label="save action">
      <Icon data={save}></Icon>
    </Button>
    <Button variant="ghost_icon" color="danger" aria-label="save action">
      <Icon data={save}></Icon>
    </Button>
    <Button variant="ghost_icon" disabled aria-label="save action">
      <Icon data={save}></Icon>
    </Button>
    <Button variant="contained_icon" aria-label="add action">
      <Icon data={add}></Icon>
    </Button>
    <Button variant="contained_icon" color="secondary" aria-label="add action">
      <Icon data={add}></Icon>
    </Button>
    <Button variant="contained_icon" color="danger" aria-label="add action">
      <Icon data={add}></Icon>
    </Button>
    <Button variant="contained_icon" disabled aria-label="add action">
      <Icon data={add}></Icon>
    </Button>
  </>
)
All.decorators = [
  (Story) => (
    <Stack
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, auto)',
      }}
    >
      <Story />
    </Stack>
  ),
]

export const FullWidth: Story<ButtonProps> = () => (
  <>
    <Button fullWidth>Primary</Button>
    <Button color="secondary" fullWidth>
      Secondary
    </Button>
    <Button color="danger" fullWidth>
      Danger
    </Button>
    <Button disabled fullWidth>
      Disabled
    </Button>
    <Button fullWidth aria-label="save action">
      <Icon data={save}></Icon>Primary
    </Button>
    <Button color="secondary" fullWidth aria-label="save action">
      <Icon data={save}></Icon>Secondary
    </Button>
    <Button color="danger" fullWidth aria-label="save action">
      <Icon data={save}></Icon>Danger
    </Button>
    <Button disabled fullWidth aria-label="save action">
      <Icon data={save}></Icon>Disabled
    </Button>
    <Button fullWidth aria-label="save action">
      Primary <Icon data={save}></Icon>
    </Button>
    <Button color="secondary" fullWidth aria-label="save action">
      Secondary
      <Icon data={save}></Icon>
    </Button>
    <Button color="danger" fullWidth aria-label="save action">
      Danger
      <Icon data={save}></Icon>
    </Button>
    <Button disabled fullWidth aria-label="save action">
      Disabled
      <Icon data={save}></Icon>
    </Button>
  </>
)
FullWidth.storyName = 'Full width'
FullWidth.decorators = [
  (Story) => (
    <div style={{ margin: '32px', display: 'grid', gridGap: '16px' }}>
      <Story />
    </div>
  ),
]

export const Compact: Story<ButtonProps> = () => {
  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    // Simulate user change
    setDensity('compact')
  }, [density])

  return (
    <EdsProvider density={density}>
      <Button>Contained</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="ghost_icon" aria-label="menu action">
        <Icon data={menu} title="Ghost icon menu"></Icon>
      </Button>
      <Button.Group aria-label="compact">
        <Button>Contained</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="outlined">Outlined</Button>
      </Button.Group>
    </EdsProvider>
  )
}
Compact.decorators = [
  (Story) => (
    <Stack>
      <Story />
    </Stack>
  ),
]

export const GroupHorizontal: Story<ButtonGroupProps> = () => (
  <Button.Group aria-label="primary">
    <Button>Contained</Button>
    <Button variant="outlined">Outlined</Button>
    <Button variant="outlined">Outlined</Button>
    <Button variant="outlined">Outlined</Button>
  </Button.Group>
)
GroupHorizontal.decorators = [
  (Story) => (
    <Stack>
      <Story />
    </Stack>
  ),
]

export const GroupVertical: Story<ButtonGroupProps> = () => (
  <Button.Group aria-label="vertical" vertical>
    <Button>Contained</Button>
    <Button variant="outlined">Outlined</Button>
    <Button variant="outlined">Outlined</Button>
    <Button variant="outlined">Outlined</Button>
  </Button.Group>
)
GroupVertical.decorators = [
  (Story) => (
    <Stack>
      <Story />
    </Stack>
  ),
]

export const GroupSplit: Story<ButtonGroupProps> = () => {
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
    <Button.Group aria-label="split button" style={{ gap: '1px' }}>
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
    </Button.Group>
  )
}
GroupSplit.decorators = [
  (Story) => (
    <Stack>
      <Story />
    </Stack>
  ),
]

export const ToggleButton: Story<ToggleButtonProps> = () => {
  const [selectedButtons, setSelectedButtons] = useState([0, 2])
  const handleChange = (indexes: number[]) => {
    setSelectedButtons(indexes)
  }

  return (
    <Button.Toggle multiple selected={selectedButtons} onChange={handleChange}>
      <Button aria-label="save action">
        <Icon data={save} title="Ghost icon save"></Icon>
      </Button>
      <Button aria-label="edit action">
        <Icon data={edit} title="Ghost icon edit"></Icon>
      </Button>
      <Button aria-label="copy action">
        <Icon data={copy} title="Ghost icon copy"></Icon>
      </Button>
    </Button.Toggle>
  )
}
