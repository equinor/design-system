import { Meta, Story } from '@storybook/react/types-6-0'
import React, { useState } from 'react'
import { DatePicker, DatePickerProps } from './DatePicker'
import { TimePicker } from '../TimePicker/TimePicker'

const DatePickerWrapper: React.FC<DatePickerProps> = ({
  id,
  value,
  className,
  popperPlacement,
}: DatePickerProps) => {
  const [dateValue, setDateValue] = useState(value)
  const onChanged = (date): void => {
    setDateValue(date)
  }

  const [timeValue, setTimeValue] = useState('11:00')
  const onTimeChanged = (date): void => {
    setTimeValue(date)
  }

  return (
    <div style={{ width: '500px' }}>
      <h2>Default date picker</h2>
      <DatePicker
        id={id}
        value={dateValue}
        label={'Date'}
        onChanged={onChanged}
        className={className}
        popperPlacement={popperPlacement}
      />
      <h2>Date picker with TimePicker</h2>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <DatePicker
          id={id + 't'}
          value={dateValue}
          label={'Choose date'}
          onChanged={onChanged}
          className={className}
          popperPlacement={popperPlacement}
        />
        <TimePicker
          id="timePickerElement"
          label="Choose Time"
          value={timeValue}
          onValueChanged={onTimeChanged}
        />
      </div>
    </div>
  )
}

export default {
  title: 'Components/DatePicker',
  component: DatePickerWrapper,
  argTypes: {},
} as Meta

export const Default: Story<DatePickerProps> = (args) => (
  <DatePickerWrapper {...args} />
)

Default.args = {
  id: 'StoryDatePicker',
  value: new Date(),
  label: 'Test Date',
  className: 'storyPicker',
  popperPlacement: 'bottom',
}
