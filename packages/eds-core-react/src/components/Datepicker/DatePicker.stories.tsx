import { Meta, StoryFn } from '@storybook/react'
import page from './Datepicker.docs.mdx'
import { Stack } from '../../../.storybook/components'
import { DatePicker } from './DatePicker'
import { DatePickerProps } from './props'
import { useState } from 'react'
import { Autocomplete } from '../Autocomplete'
import { NativeSelect } from '../Select'
import { action } from '@storybook/addon-actions'

const meta: Meta<typeof DatePicker> = {
  title: 'Inputs/Dates/Datepicker',
  component: DatePicker,
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
            gridTemplateColumns: '300px',
            alignItems: 'start',
            height: '400px',
          }}
        >
          <Story />
        </Stack>
      )
    },
  ],
}

export default meta

export const Introduction: StoryFn = (props: DatePickerProps) => {
  return (
    <DatePicker
      {...props}
      onChange={(v) => {
        const str = v.toISOString()
        action('onChange')(str)
      }}
    />
  )
}

const min = new Date()
const max = new Date()
min.setDate(2)
max.setMonth(max.getMonth() + 1)
max.setDate(-1)

export const WithMinAndMaxValue: StoryFn = (args) => (
  <DatePicker {...args} minValue={min} maxValue={max} />
)

export const LimitSpecificDays: StoryFn<DatePickerProps> = (args) => {
  const isDateUnavailable = (d: Date) => d.getDay() === 0 || d.getDay() === 6
  return <DatePicker {...args} isDateUnavailable={isDateUnavailable} />
}

export const DateTime: StoryFn = () => {
  const [val, setValue] = useState(new Date())
  return (
    <DatePicker
      showTimeInput={true}
      value={val}
      onChange={(v) => {
        setValue(v)
        action('onChange')(v.toISOString())
      }}
    />
  )
}

const minusOneMonth = new Date()
minusOneMonth.setMonth(minusOneMonth.getMonth() - 1)
const plusOneMonth = new Date()
plusOneMonth.setMonth(plusOneMonth.getMonth() + 1)

const options = [
  { value: new Date(), label: 'Today' },
  { value: minusOneMonth, label: 'Previous month' },
  { value: plusOneMonth, label: 'Next month' },
]

export const CustomHeaderFooter: StoryFn<DatePickerProps> = ({
  value,
  ...args
}) => {
  const [val, setValue] = useState(value ?? new Date())
  return (
    <DatePicker
      {...args}
      value={val}
      onChange={setValue}
      Header={({ setYear, setMonth, year, month }) => {
        const yrs: Array<string> = []
        for (let i = 0; i < 30; i++) {
          yrs.push(`20${String(i).padStart(2, '0')}`)
        }
        return (
          <div>
            <button onClick={() => setMonth(month - 1)}>-</button>
            <NativeSelect
              style={{
                display: 'inline-block',
                width: 100,
              }}
              defaultValue={year}
              onChange={(e) => {
                setYear(Number(e.currentTarget.value))
              }}
              id={'set-year'}
              label={undefined}
            >
              {yrs.map((y) => (
                <option value={y} key={y}>
                  {y}
                </option>
              ))}
            </NativeSelect>
            -{month}
            <button onClick={() => setMonth(month + 1)}>+</button>
          </div>
        )
      }}
      footer={
        <div style={{ paddingBottom: 4 }}>
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
