// In some cases we need to use the index as key
/* eslint-disable react/no-array-index-key */
import {
  DateFieldStateOptions,
  useDateFieldState,
} from '@react-stately/datepicker'
import { useDateField } from 'react-aria'
import { CalendarDate, createCalendar } from '@internationalized/date'
import { DateSegment } from './DateSegment'
import { forwardRef, RefObject } from 'react'

type Props = Partial<DateFieldStateOptions>

/**
 * A field that wraps segments for inputting a date / date-time
 */
export const DateFieldSegments = forwardRef(
  (props: Props, ref: RefObject<HTMLDivElement | null>) => {
    // Use January 1st as placeholder when no value is set.
    // This ensures the day segment allows values up to 31,
    // preventing eager auto-advance when typing "3" (which
    // would otherwise auto-complete to "03" in months with
    // fewer than 30 days, like February).
    const placeholderValue =
      props.placeholderValue ?? new CalendarDate(new Date().getFullYear(), 1, 1)

    const state = useDateFieldState({
      ...props,
      locale: props.locale,
      createCalendar,
      placeholderValue,
    })

    const { fieldProps } = useDateField(
      {
        ...props,
        // Type-casting as react-aria expects string | ReactNode, but we only pass strings
        'aria-label': (props.label as string) ?? 'Date input field',
      },
      state,
      ref,
    )

    return (
      <div
        {...fieldProps}
        style={{
          display: 'flex',
          fontFamily: 'Equinor, Arial, sans-serif',
        }}
        ref={ref}
      >
        {state.segments.map((segment, i) => (
          <DateSegment key={i} segment={segment} state={state} />
        ))}
      </div>
    )
  },
)

DateFieldSegments.displayName = 'SingleDateField'
