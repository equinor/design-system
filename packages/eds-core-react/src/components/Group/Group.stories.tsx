import { Button, Group, GroupProps } from '../..'
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
