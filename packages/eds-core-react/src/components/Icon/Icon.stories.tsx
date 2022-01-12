import { useState, useEffect } from 'react'
import { Story, ComponentMeta } from '@storybook/react'
import * as icons from '@equinor/eds-icons'
import { Stack } from './../../../.storybook/components'
import { Icon, IconProps, Density, EdsProvider } from '../..'
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

export const Introduction: Story<IconProps> = (args) => <Icon {...args} />

Introduction.args = {
  name: 'save',
  size: 24,
  title: 'save',
}

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
    <Icon name="compare" size={16} />
    <Icon name="compare" size={24} />
    <Icon name="compare" size={32} />
    <Icon name="compare" size={40} />
    <Icon name="compare" size={48} />
  </Stack>
)

export const Compact: Story<IconProps> = () => {
  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    // Simulate user change
    setDensity('compact')
  }, [density])

  return (
    <EdsProvider density={density}>
      <Stack>
        <Icon data={icons.fullscreen} />
        <Icon data={icons.search} />
        <Icon data={icons.check_circle_outlined} />
      </Stack>
    </EdsProvider>
  )
}
