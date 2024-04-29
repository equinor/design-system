import 'react-datepicker/dist/react-datepicker.css'

import { useState } from 'react'
import styled from 'styled-components'
import { StoryObj, Meta } from '@storybook/react'
import { DatePicker, DatePickerProps } from './DatePicker'
import { TimePicker } from '../TimePicker/TimePicker'
import { DatePickerSelectHeader } from './DatePickerSelectHeader'

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

export const Default: StoryObj<DatePickerProps> = {
  args: {
    id: 'StoryDatePicker',
    dateValue: new Date(),
    label: 'Test Date',
    className: 'storyPicker',
    popperPlacement: 'bottom-start',
  },
}

export const WithTimePicker: StoryObj<DatePickerProps> = {
  render: function Render({ id, dateValue, className }: DatePickerProps) {
    const [startDate, setStartDate] = useState(dateValue)
    const onChanged = (date: Date): void => {
      setStartDate(date)
    }

    const [timeValue, setTimeValue] = useState('11:00')
    const onTimeChanged = (date: string): void => {
      setTimeValue(date)
    }

    return (
      <Container>
        <Row>
          <DatePicker
            id={id + 't'}
            dateValue={startDate}
            label={'Choose date'}
            onChanged={onChanged}
            className={className}
            popperPlacement="bottom-start"
          />
          <TimePicker
            label="Choose Time"
            value={timeValue}
            onValueChanged={onTimeChanged}
          />
        </Row>
      </Container>
    )
  },

  parameters: {
    docs: {
      description: {
        component: `The date picker is usually accompanied by a time picker to set time and date more precicely.`,
      },
    },
  },
}

export const DatePickerDisabledBefore: StoryObj<DatePickerProps> = {
  render: function Render({ id, dateValue, className }: DatePickerProps) {
    const [startDate, setStartDate] = useState(dateValue)
    const onChanged = (date: Date): void => {
      setStartDate(date)
    }

    return (
      <DatePicker
        id={id}
        dateValue={startDate}
        label={'Date'}
        onChanged={onChanged}
        className={className}
        popperPlacement="bottom-start"
        disableBeforeDate={new Date()}
      />
    )
  },

  parameters: {
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
  },
}

export const DatePickerDisabledFuture: StoryObj<DatePickerProps> = {
  render: function Render({ id, dateValue, className }: DatePickerProps) {
    const [startDate, setStartDate] = useState(dateValue)
    const onChanged = (date: Date): void => {
      setStartDate(date)
    }

    return (
      <DatePicker
        id={id}
        dateValue={startDate}
        label={'Date'}
        onChanged={onChanged}
        className={className}
        popperPlacement="bottom-start"
        disableFuture={true}
      />
    )
  },

  parameters: {
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
  },
}

export const DatePickerDisabled: StoryObj<DatePickerProps> = {
  render: function Render({
    id,
    dateValue,
    className,
    popperPlacement,
  }: DatePickerProps) {
    const [startDate, setStartDate] = useState(dateValue)
    const onChanged = (date: Date): void => {
      setStartDate(date)
    }

    return (
      <DatePicker
        id={id}
        dateValue={startDate}
        label={'Date'}
        onChanged={onChanged}
        className={className}
        popperPlacement={popperPlacement}
        disabled={true}
      />
    )
  },

  parameters: {
    docs: {
      description: {
        component: `The date picker when disabled`,
      },
    },
    decorators: [
      (Story) => (
        <div style={{ padding: '1em', height: '380px' }}>
          <Story />
        </div>
      ),
    ],
  },
}

export const DatePickerWithCustomHeader: StoryObj<DatePickerProps> = {
  render: function Render({ id, dateValue, className }: DatePickerProps) {
    //import { DatePickerSelectHeader } from '@equinor/eds-lab-react'
    const [startDate, setStartDate] = useState(dateValue)
    const onChanged = (date: Date): void => {
      setStartDate(date)
    }

    return (
      <DatePicker
        id={id}
        dateValue={startDate}
        label={'Date'}
        onChanged={onChanged}
        className={className}
        popperPlacement="bottom-start"
        disableBeforeDate={new Date()}
        renderCustomHeader={DatePickerSelectHeader}
      />
    )
  },

  parameters: {
    docs: {
      description: {
        component: `The date picker with custom header.`,
        story:
          '`renderCustomHeader` allows you to make your own custom header. We have included a `DatePickerSelectHeader` which can be used directly or as a starting point for your own implementation. See also https://reactdatepicker.com/#example-custom-header',
      },
    },
    decorators: [
      (Story) => (
        <div style={{ padding: '1em', height: '380px' }}>
          <Story />
        </div>
      ),
    ],
  },
}

const meta: Meta<typeof DatePicker> = {
  title: 'Components/⚠️ DatePicker',
  component: DatePicker,
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
      description: {
        component:
          "⚠️ **`@equinor/eds-core-react` now has new `DatePicker` and `DateRangePicker` components which replaces the need for this. Please use those instead.** <br>The date picker is a community contributed component based around `react-datepicker`. It opens an overlaying interactive calendar that allows the user to select a date. If a date is chosen, this is reflected in the input field. Under some circumstances `Datepicker` is missing it's styles. A workaround is to import the css explicitly: `import 'react-datepicker/dist/react-datepicker.css';`",
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
}

export default meta
