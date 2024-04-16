import { Meta, StoryFn } from '@storybook/react'
import page from './Datepicker.docs.mdx'
import { Stack } from '../../../.storybook/components'
import { DateRangePickerProps } from './props'
import { useState } from 'react'
import { DateRangePicker } from './DateRangePicker'
import { Autocomplete } from '../Autocomplete'
import { action } from '@storybook/addon-actions'

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

const minusOneMonth = new Date()
minusOneMonth.setMonth(minusOneMonth.getMonth() - 1)
const plusOneMonth = new Date()
plusOneMonth.setMonth(plusOneMonth.getMonth() + 1)

const options = [
  { value: { from: new Date(), to: new Date() }, label: 'Today' },
  {
    value: { from: minusOneMonth, to: plusOneMonth },
    label: '-1 month to +1 month',
  },
]

export const CustomHeaderFooter: StoryFn<DateRangePickerProps> = (args) => {
  const [val, setValue] = useState({ from: null, to: null })
  return (
    <DateRangePicker
      {...args}
      value={val}
      onChange={setValue}
      Header={({ setMonth, year, month }) => {
        const yrs: Array<string> = []
        for (let i = 0; i < 30; i++) {
          yrs.push(`20${String(i).padStart(2, '0')}`)
        }
        return (
          <div>
            <button onClick={() => setMonth(month - 1)}>-</button>
            {year}-{month}
            <button onClick={() => setMonth(month + 1)}>+</button>
          </div>
        )
      }}
      footer={
        <div style={{ paddingBottom: '4px' }}>
          <Autocomplete
            options={options}
            label={'Preset'}
            optionLabel={(v) => v.label}
            onOptionsChange={(v) => {
              const sel = v.selectedItems[0].value
              setValue(sel)
            }}
          />
        </div>
      }
    />
  )
}
