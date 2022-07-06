import { useState, useEffect } from 'react'
import {
  Button,
  Icon,
  ButtonProps,
  EdsProvider,
  Density,
  Progress,
} from '../..'
import { Story, ComponentMeta } from '@storybook/react'
import { menu, add, save } from '@equinor/eds-icons'
import { Stack } from './../../../.storybook/components'
// import { Group } from '../Group'
import page from './Button.docs.mdx'

export default {
  title: 'Inputs/Button',
  component: Button,
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
Introduction.args = {
  as: undefined,
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
        gridTemplateColumns: 'repeat(4, fit-content(100%))',
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
    <Button fullWidth>
      <Icon data={save}></Icon>Primary
    </Button>
    <Button color="secondary" fullWidth>
      <Icon data={save}></Icon>Secondary
    </Button>
    <Button color="danger" fullWidth>
      <Icon data={save}></Icon>Danger
    </Button>
    <Button disabled fullWidth>
      <Icon data={save}></Icon>Disabled
    </Button>
    <Button fullWidth>
      Primary <Icon data={save}></Icon>
    </Button>
    <Button color="secondary" fullWidth>
      Secondary
      <Icon data={save}></Icon>
    </Button>
    <Button color="danger" fullWidth>
      Danger
      <Icon data={save}></Icon>
    </Button>
    <Button disabled fullWidth>
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
      <Button variant="ghost_icon">
        <Icon data={menu} title="Ghost icon menu"></Icon>
      </Button>
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

// export const ButtonGroup: Story<ButtonProps> = () => (
//   <Stack style={{ gridGap: 0 }}>
//     <Group>
//       <Button>Contained</Button>
//       <Button variant="outlined">Outlined</Button>
//       <Button variant="outlined">Outlined</Button>
//       <Button variant="outlined">Outlined</Button>
//     </Group>
//   </Stack>
// )
