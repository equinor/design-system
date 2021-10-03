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
  height: 480px;
  width: 100%;
  padding: 32px;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: 200px;
  grid-gap: 32px 32px;
  background: #ebebeb;
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
