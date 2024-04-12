import { Meta, StoryFn } from '@storybook/react'
import page from './Datepicker.docs.mdx'
import { Stack } from '../../../.storybook/components'
import { Calendar } from './calendars/Calendar'
import { CalendarStateOptions } from '@react-stately/calendar'
import {
  CalendarDate,
  CalendarDateTime,
  createCalendar,
  toCalendarDate,
} from '@internationalized/date'
import { CalendarProps, useDatePicker, useLocale } from 'react-aria'
import {
  DatePickerStateOptions,
  useDatePickerState,
} from '@react-stately/datepicker'
import { useMemo, useRef, useState } from 'react'
import { action } from '@storybook/addon-actions'

const meta: Meta<typeof Calendar> = {
  title: 'Inputs/Dates/Calendar',
  component: Calendar,
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
}: CalendarStateOptions<CalendarDate | CalendarDateTime>) => {
  const [value, setValue] = useState<CalendarDate | CalendarDateTime>()
  const { locale } = useLocale()
  const dateCreateProps = useMemo<
    DatePickerStateOptions<CalendarDate | CalendarDateTime>
  >(() => {
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

  const pickerState = useDatePickerState(dateCreateProps)
  const { calendarProps } = useDatePicker(dateCreateProps, pickerState, ref)
  return (
    <Calendar
      state={pickerState}
      locale={locale}
      {...(calendarProps as CalendarProps<CalendarDate | CalendarDateTime>)}
      value={value ? toCalendarDate(value) : null}
      createCalendar={createCalendar}
      ref={ref}
    />
  )
}
