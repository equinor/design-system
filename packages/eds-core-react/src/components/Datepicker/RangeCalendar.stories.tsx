import { Meta, StoryFn } from '@storybook/react'
import page from './Datepicker.docs.mdx'
import { Stack } from '../../../.storybook/components'
import { DateValue, useDateRangePicker, useLocale } from 'react-aria'
import {
  DateRangePickerStateOptions,
  useDateRangePickerState,
} from '@react-stately/datepicker'
import { useMemo, useRef, useState } from 'react'
import { action } from '@storybook/addon-actions'
import { RangeCalendar } from './calendars/RangeCalendar'
import { RangeValue } from '@react-types/shared'

const meta: Meta<typeof RangeCalendar> = {
  title: 'Inputs/Dates/RangeCalendar',
  component: RangeCalendar,
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

export const Introduction: StoryFn = ({
  isDisabled,
}: DateRangePickerStateOptions) => {
  const [value, setValue] = useState<RangeValue<DateValue>>()
  const { locale } = useLocale()
  const dateCreateProps = useMemo<DateRangePickerStateOptions>(() => {
    return {
      isDisabled: isDisabled,
      locale,
      value,
      onChange: (v) => {
        setValue(v)
        action('onChange')(v)
      },
    }
  }, [locale, value, isDisabled])

  const ref = useRef()

  const pickerState = useDateRangePickerState(dateCreateProps)
  const { calendarProps } = useDateRangePicker(
    dateCreateProps,
    pickerState,
    ref,
  )
  return <RangeCalendar {...calendarProps} value={value} ref={ref} />
}
