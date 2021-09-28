import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'
import { TimePicker, TimePickerProps } from './TimePicker'

export default {
  title: 'Components/TimePicker',
  component: TimePicker,
  argTypes: {},
} as Meta

const Default: Story<TimePickerProps> = (args) => <TimePicker {...args} />

Default.args = {
  id: 'StoryTimePicker',
  label: 'Test Time',
  className: 'storyTimePicker',
}
