import React, { useState } from 'react'
import styled from 'styled-components'
import { Meta, Story } from '@storybook/react/types-6-0'
import { DatePicker, DatePickerProps } from './DatePicker'
import { TimePicker } from '../TimePicker/TimePicker'

const Container = styled.div`
  height: 800px;
  width: 100%;
  padding: 32px;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: 200px;
  grid-gap: 32px 32px;
  background: #ebebeb;
`

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
    <Container>
      <div>
        <h2>Default date picker</h2>
        <DatePicker
          id={id}
          value={dateValue}
          label={'Date'}
          onChanged={onChanged}
          className={className}
          popperPlacement={popperPlacement}
        />
      </div>
      <div>
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
            label="Choose Time"
            value={timeValue}
            onValueChanged={onTimeChanged}
          />
        </div>
      </div>
    </Container>
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
