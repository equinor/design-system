import { MutableRefObject, ReactNode, HTMLAttributes } from 'react'
import { CalendarState, RangeCalendarState } from '@react-stately/calendar'
import { Variants } from '../types'
import { HelperTextProps } from '../InputWrapper/HelperText'
import { DateFormatterOptions } from 'react-aria'

type DateRange = { from: Date | null; to: Date | null }

export type HeaderFooterProps<T = CalendarState | RangeCalendarState> = {
  setYear: (year: number) => void
  setMonth: (month: number) => void
  year: number
  month: number
  state: T
}

export type DatePickerProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> &
  Partial<{
    /**
     * The variant / state of the datepicker field
     * @default undefined
     */
    variant: Variants
    /**
     * Whether the datepicker field is disabled
     * @default false
     */
    disabled?: boolean
    // eslint-disable-next-line react/no-unused-prop-types
    readOnly?: boolean
    /**
     * Props to set the helper text
     */
    helperProps?: HelperTextProps
    /**
     * Controlled value
     */
    value: Date | null
    /**
     * The function to call when the datepicker field value changes
     */
    onChange: (date: Date | null) => void
    /**
     * The field label
     */
    label: string
    /**
     * minValue sets a limit to how far back the datepicker allows you to go
     * note: this does not prevent you from typing in a date that is before the minValue
     * @default undefined
     */
    minValue: Date
    /**
     * maxValue sets a limit to how far back the datepicker allows you to go
     * note: this does not prevent you from typing in a date that is after the maxValue
     * @default undefined
     */
    maxValue: Date
    /**
     * isDateUnavailable is used to disable specific dates (e.g. weekends)
     */
    isDateUnavailable?: (v: Date) => boolean
    /**
     * An optional footer to display below the calendar, useful for e.g. presets
     */
    Footer: (props: HeaderFooterProps<CalendarState>) => ReactNode
    /**
     * An optional header to display above the calendar, can be used to override the default
     * The component is fed with enough props to be able to control the calendar-view
     */
    Header: (props: HeaderFooterProps<CalendarState>) => ReactNode
    /**
     * Whether to allow picking the time as well as the date
     */
    showTimeInput?: boolean
    /**
     * hide the clear button even when date is set
     * @default false
     */
    hideClearButton?: boolean
    /**
     * Uncontrolled value
     */
    defaultValue?: Date | null
    /**
     * Timezone to use for the datepicker
     */
    timezone: string
    /**
     * Granularity of the time field if enabled
     */
    granularity?: 'hour' | 'minute' | 'second'
    /**
     * Format options for the datepicker input field
     * Only applies when input is blurred
     */
    formatOptions?: DateFormatterOptions
  }>

export type DateTimePickerProps = Omit<
  DatePickerProps,
  'onChange' | 'value' | 'multiple'
> & {
  onChange: (date: Date | null) => void
  value: Date | null
}

export type DateRangePickerProps = Omit<
  DatePickerProps,
  | 'onChange'
  | 'value'
  | 'multiple'
  | 'stateRef'
  | 'showTimeInput'
  | 'defaultValue'
> &
  Partial<{
    onChange: (range: DateRange | null) => void
    value: DateRange
    stateRef: MutableRefObject<RangeCalendarState>
    defaultValue: DateRange
    /**
     * An optional footer to display below the calendar, useful for e.g. presets
     */
    Footer: (props: HeaderFooterProps<RangeCalendarState>) => ReactNode
    /**
     * An optional header to display above the calendar, can be used to override the default
     * The component is fed with enough props to be able to control the calendar-view
     */
    Header: (props: HeaderFooterProps<RangeCalendarState>) => ReactNode
  }>
