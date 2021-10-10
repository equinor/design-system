import React, { useState } from 'react'
import styled from 'styled-components'
import { Meta, Story } from '@storybook/react/types-6-0'
import { DatePicker, DatePickerProps } from './DatePicker'
import { TimePicker } from '../TimePicker/TimePicker'

const Container = styled.div`
  height: 380px;
  width: 100%;
  box-sizing: border-box;
`

const Row = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: auto auto;
  justify-content: left;
  grid-column-gap: 2px;
`

export const Default: Story<DatePickerProps> = (args) => (
  <DatePicker {...args} />
)

Default.args = {
  id: 'StoryDatePicker',
  value: new Date(),
  label: 'Test Date',
  className: 'storyPicker',
  popperPlacement: 'bottom',
}

export const WithTimePicker: Story<DatePickerProps> = ({
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
      <Row>
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
      </Row>
    </Container>
  )
}

WithTimePicker.parameters = {
  docs: {
    description: {
      component: `The date picker is usually accompanied by a time picker to set time and date more precicely.`,
    },
  },
}

export const DatePickerDisabledBefore: Story<DatePickerProps> = ({
  id,
  value,
  className,
  popperPlacement,
}: DatePickerProps) => {
  const [dateValue, setDateValue] = useState(value)
  const onChanged = (date): void => {
    setDateValue(date)
  }

  return (
    <DatePicker
      id={id}
      value={dateValue}
      label={'Date'}
      onChanged={onChanged}
      className={className}
      popperPlacement={popperPlacement}
      disableBeforeDate={new Date()}
    />
  )
}

DatePickerDisabledBefore.parameters = {
  docs: {
    description: {
      component: `The date picker with disabled previous dates from selection.`,
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '1em', height: '380px' }}>
        <Story />
      </div>
    ),
  ],
}

export const DatePickerDisabledFuture: Story<DatePickerProps> = ({
  id,
  value,
  className,
  popperPlacement,
}: DatePickerProps) => {
  const [dateValue, setDateValue] = useState(value)
  const onChanged = (date): void => {
    setDateValue(date)
  }

  return (
    <DatePicker
      id={id}
      value={dateValue}
      label={'Date'}
      onChanged={onChanged}
      className={className}
      popperPlacement={popperPlacement}
      disableFuture={true}
    />
  )
}

DatePickerDisabledFuture.parameters = {
  docs: {
    description: {
      component: `The date picker with disabled future dates.`,
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '1em', height: '380px' }}>
        <Story />
      </div>
    ),
  ],
}

export default {
  title: 'Components/DatePicker',
  component: DatePicker,
  argTypes: {},
  parameters: {
    docs: {
      description: {
        component: `The date picker opens as an overlaying interactive calendar that allows the user to select a date. If a date is chosen, this is reflected in the input field.`,
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '1em', height: '380px' }}>
        <Story />
      </div>
    ),
  ],
} as Meta
