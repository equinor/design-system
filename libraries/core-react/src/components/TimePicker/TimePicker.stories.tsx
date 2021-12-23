import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'
import styled from 'styled-components'
import { TimePicker, TimePickerProps } from './TimePicker'

export default {
  title: 'Components/TimePicker',
  component: TimePicker,
  argTypes: {},
} as Meta

const Container = styled.div`
  height: 360px;
  width: 100%;
  box-sizing: border-box;
`

export const Default: Story<TimePickerProps> = (args) => (
  <Container>
    <TimePicker {...args} />
  </Container>
)

Default.args = {
  label: 'Test Time',
  className: 'storyTimePicker',
}
