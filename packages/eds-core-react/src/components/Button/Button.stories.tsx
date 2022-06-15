import { useState, useEffect } from 'react'
import {
  Button,
  Icon,
  ButtonProps,
  EdsProvider,
  Density,
  Progress,
} from '../..'
import styled from 'styled-components'
import { Story, ComponentMeta } from '@storybook/react'
import { menu } from '@equinor/eds-icons'
import { Stack as SBStack } from './../../../.storybook/components'
// import { Group } from '../Group'
import page from './Button.docs.mdx'

const Stack = styled(SBStack)`
  display: grid;
  grid-template-columns: repeat(4, fit-content(100%));
`

const FullWidthStack = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 16px;
`

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
    },
  },
} as ComponentMeta<typeof Button>

export const Introduction: Story<ButtonProps> = (args) => (
  <Stack>
    <Button {...args}>You can control me</Button>
  </Stack>
)
Introduction.args = {
  as: undefined,
}

export const Basic: Story<ButtonProps> = () => (
  <Stack>
    <Button>Contained</Button>
    <Button variant="outlined">Outlined</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="ghost_icon">
      <Icon name="save" title="save action"></Icon>
    </Button>
  </Stack>
)

export const GhostIcon: Story<ButtonProps> = () => (
  <Stack>
    <Button variant="ghost_icon">
      <Icon name="save" title="save action"></Icon>
    </Button>
    <Button variant="ghost_icon" color="secondary">
      <Icon name="save" title="save"></Icon>
    </Button>
    <Button variant="ghost_icon" color="danger">
      <Icon name="save" title="save"></Icon>
    </Button>
    <Button variant="ghost_icon" disabled>
      <Icon name="save" title="save"></Icon>
    </Button>
  </Stack>
)
GhostIcon.storyName = 'Ghost icon'

export const Color: Story<ButtonProps> = () => (
  <Stack>
    <Button color="primary">Primary</Button>
    <Button color="secondary">Secondary</Button>
    <Button color="danger">Danger</Button>
  </Stack>
)

export const Hierarchy: Story<ButtonProps> = () => (
  <Stack>
    <Button>Contained</Button>
    <Button variant="outlined">Outlined</Button>
    <Button variant="ghost">Ghost</Button>
  </Stack>
)

export const FileUpload: Story<ButtonProps> = () => (
  <Stack>
    <label htmlFor="file-upload">
      <input
        type="file"
        id="file-upload"
        style={{ display: 'none' }}
        multiple
      />
      <Button as="span">Upload file</Button>
    </label>
  </Stack>
)
FileUpload.storyName = 'File upload'

export const ProgressButton: Story<ButtonProps> = () => (
  <Stack>
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
  </Stack>
)
ProgressButton.storyName = 'Progress button'

export const All: Story<ButtonProps> = () => (
  <Stack>
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
    <Button variant="ghost_icon">
      <Icon name="save" title="save action"></Icon>
    </Button>
    <Button variant="ghost_icon" color="secondary">
      <Icon name="save" title="save"></Icon>
    </Button>
    <Button variant="ghost_icon" color="danger">
      <Icon name="save" title="save"></Icon>
    </Button>
    <Button variant="ghost_icon" disabled>
      <Icon name="save" title="save"></Icon>
    </Button>
  </Stack>
)

export const FullWidth: Story<ButtonProps> = () => (
  <FullWidthStack>
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
      <Icon name="save" title="save"></Icon>Primary
    </Button>
    <Button color="secondary" fullWidth>
      <Icon name="save" title="save"></Icon>Secondary
    </Button>
    <Button color="danger" fullWidth>
      <Icon name="save" title="save"></Icon>Danger
    </Button>
    <Button disabled fullWidth>
      <Icon name="save" title="save"></Icon>Disabled
    </Button>
    <Button fullWidth>
      Primary <Icon name="save" title="save"></Icon>
    </Button>
    <Button color="secondary" fullWidth>
      Secondary
      <Icon name="save" title="save"></Icon>
    </Button>
    <Button color="danger" fullWidth>
      Danger
      <Icon name="save" title="save"></Icon>
    </Button>
    <Button disabled fullWidth>
      Disabled
      <Icon name="save" title="save"></Icon>
    </Button>
  </FullWidthStack>
)
FullWidth.storyName = 'Full width'

export const Compact: Story<ButtonProps> = () => {
  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    // Simulate user change
    setDensity('compact')
  }, [density])

  return (
    <EdsProvider density={density}>
      <Stack>
        <Button>Contained</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="ghost_icon">
          <Icon data={menu} title="Ghost icon menu"></Icon>
        </Button>
      </Stack>
    </EdsProvider>
  )
}

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
