import { useState, useEffect } from 'react'
import { Button, Density, EdsProvider, Group, GroupProps } from '../..'
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
    <Group {...args}>
      <Button>Contained</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="outlined">Outlined</Button>
    </Group>
  )
}

export const Vertical: Story<GroupProps> = () => (
  <Group vertical>
    <Button>Contained</Button>
    <Button variant="outlined">Outlined</Button>
    <Button variant="outlined">Outlined</Button>
    <Button variant="outlined">Outlined</Button>
  </Group>
)

export const Compact: Story<GroupProps> = () => {
  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    // Simulate user change
    setDensity('compact')
  }, [density])

  return (
    <EdsProvider density={density}>
      <Group>
        <Button>Contained</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="outlined">Outlined</Button>
      </Group>
      <Group vertical>
        <Button>Contained</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="outlined">Outlined</Button>
      </Group>
    </EdsProvider>
  )
}
