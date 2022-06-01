import { Story, ComponentMeta } from '@storybook/react'
import * as icons from '@equinor/eds-icons'
import { Stack } from './../../../.storybook/components'
import { Icon, IconProps } from '../..'
import page from './Icon.docs.mdx'

Icon.add(icons)

export default {
  title: 'Icons/Icon',
  component: Icon,
  argTypes: {
    name: {
      options: Object.keys(icons),
      control: {
        type: 'select',
      },
    },
    color: {
      control: 'color',
    },
  },
  parameters: {
    docs: {
      page,
    },
  },
} as ComponentMeta<typeof Icon>

export const Introduction: Story<IconProps> = (args) => (
  <Stack>
    <Icon {...args} />
  </Stack>
)

Introduction.args = {
  name: 'save',
  size: 24,
  title: 'save',
}

export const Accessibility: Story<IconProps> = () => (
  <Stack>
    <Icon name="save" title="Save me!" />
  </Stack>
)

export const Color: Story<IconProps> = () => (
  <Stack>
    <Icon name="save" color={'red'} />
    <Icon name="save" color={'green'} />
    <Icon name="save" color={'blue'} />
  </Stack>
)

export const Rotations: Story<IconProps> = () => (
  <Stack>
    <Icon name="pregnant_woman" rotation={90} />
    <Icon name="pregnant_woman" rotation={180} />
    <Icon name="pregnant_woman" rotation={270} />
  </Stack>
)

export const Sizes: Story<IconProps> = () => (
  <Stack>
    <Icon name="fullscreen" size={16} />
    <Icon name="fullscreen" size={18} />
    <Icon name="fullscreen" size={24} />
    <Icon name="fullscreen" size={32} />
    <Icon name="fullscreen" size={40} />
    <Icon name="fullscreen" size={48} />
  </Stack>
)
