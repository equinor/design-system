import React from 'react'
import { NativeSelect, NativeSelectProps } from '@equinor/eds-core-react'
import { Story, Meta } from '@storybook/react/types-6-0'

export default {
  title: 'Components/Select/NativeSelect',
  component: NativeSelect,
} as Meta

export const Default: Story<NativeSelectProps> = (args) => (
  <NativeSelect label="Label text" {...args}>
    <option>First</option>
    <option>Second</option>
  </NativeSelect>
)
