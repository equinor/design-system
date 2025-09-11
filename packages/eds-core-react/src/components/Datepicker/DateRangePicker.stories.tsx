import { Meta, StoryFn } from '@storybook/react-vite'
import page from './Datepicker.docs.mdx'
import { Stack } from '../../../.storybook/components'
import { DateRangePickerProps } from './props'
import { useState } from 'react'
import { DateRangePicker } from './DateRangePicker'
import { action } from 'storybook/actions'

const PrimaryComponent = (props: DateRangePickerProps) => {
  const [value, setValue] = useState({
    from: new Date(),
    to: new Date(),
  })
  return (
    <DateRangePicker
      {...props}
      value={value}
      onChange={(v) => {
        action('onChange')(v)
        setValue(v)
      }}
    />
  )
}

const meta: Meta<typeof DateRangePicker> = {
  title: 'Inputs/Dates/DateRangePicker',
  component: DateRangePicker,
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <Stack
          style={{
            display: 'grid',
            gridGap: '32px',
            gridTemplateColumns: 'repeat(4, auto)',
            alignItems: 'start',
            height: '100px',
          }}
        >
          <Story />
        </Stack>
      )
    },
  ],
}

export default meta

export const Introduction: StoryFn<DateRangePickerProps> = (args) => (
  <PrimaryComponent {...args} />
)

const min = new Date()
const max = new Date()
min.setDate(2)
max.setMonth(max.getMonth() + 1)
max.setDate(-1)

export const WithMinAndMaxValue: StoryFn = (args) => (
  <DateRangePicker {...args} minValue={min} maxValue={max} />
)

export const LimitSpecificDays: StoryFn<DateRangePickerProps> = (args) => {
  const isDateUnavailable = (d: Date) => d.getDay() === 0 || d.getDay() === 6
  return <DateRangePicker {...args} isDateUnavailable={isDateUnavailable} />
}
