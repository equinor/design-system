import { StoryFn, Meta } from '@storybook/react'
import * as icons from '@equinor/eds-icons'
import { Stack } from './../../../.storybook/components'
import { Icon, IconProps } from '../..'
import page from './Icon.docs.mdx'

Icon.add(icons)

const meta: Meta<typeof Icon> = {
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
      source: {
        excludeDecorators: true,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <Stack>
          <Story />
        </Stack>
      )
    },
  ],
}

export default meta

export const Introduction: StoryFn<IconProps> = (args) => {
  return <Icon {...args} />
}
Introduction.args = {
  name: 'save',
  size: 24,
  title: 'save',
}

export const Accessibility: StoryFn<IconProps> = () => (
  <Icon name="save" title="Save me!" />
)

export const Color: StoryFn<IconProps> = () => (
  <>
    <Icon name="save" color={'red'} />
    <Icon name="save" color={'green'} />
    <Icon name="save" color={'blue'} />
  </>
)

export const Rotations: StoryFn<IconProps> = () => (
  <>
    <Icon name="pregnant_woman" rotation={90} />
    <Icon name="pregnant_woman" rotation={180} />
    <Icon name="pregnant_woman" rotation={270} />
  </>
)

export const Sizes: StoryFn<IconProps> = () => (
  <>
    <Icon name="fullscreen" size={16} />
    <Icon name="fullscreen" size={18} />
    <Icon name="fullscreen" size={24} />
    <Icon name="fullscreen" size={32} />
    <Icon name="fullscreen" size={40} />
    <Icon name="fullscreen" size={48} />
  </>
)
