// In some cases we need to use the index as key
/* eslint-disable react/no-array-index-key */
import {
  DateFieldStateOptions,
  useDateFieldState,
} from '@react-stately/datepicker'
import { useDateField, useLocale } from 'react-aria'
import { createCalendar } from '@internationalized/date'
import { DateSegment } from './DateSegment'
import { forwardRef, RefObject } from 'react'

type Props = Partial<DateFieldStateOptions>

/**
 * A field that wraps segments for inputting a date / date-time
 */
export const SingleDateField = forwardRef((props: Props, ref) => {
  const { locale } = useLocale()
  const state = useDateFieldState({
    ...props,
    locale,
    createCalendar,
  })

  const { fieldProps } = useDateField(
    {
      ...props,
      'aria-label': 'Date input field',
    },
    state,
    ref as RefObject<HTMLDivElement>,
  )

  return (
    <div
      {...fieldProps}
      style={{ display: 'flex' }}
      ref={ref as RefObject<HTMLDivElement>}
    >
      {state.segments.map((segment, i) => (
        <DateSegment key={i} segment={segment} state={state} />
      ))}
    </div>
  )
})

SingleDateField.displayName = 'SingleDateField'
