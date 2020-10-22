import React from 'react'
import { Component, ComponentProps } from '@equinor/eds-core-react'
import { Story, Meta } from '@storybook/react'

export default {
  title: 'Components/Component',
  component: Component,
  argTypes: {
    color: { control: 'color' },
  },
} as Meta

const Template: Story<ComponentProps> = (args) => (
  <Component {...args}>Tjobing!</Component>
)

export const SomeStory = Template.bind({})
