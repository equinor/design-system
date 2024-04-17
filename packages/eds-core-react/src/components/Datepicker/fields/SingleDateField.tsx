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
export const SingleDateField = forwardRef(
  (props: Props, ref: RefObject<HTMLDivElement>) => {
    const { locale } = useLocale()
    const state = useDateFieldState({
      ...props,
      locale,
      createCalendar,
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
      <div {...fieldProps} style={{ display: 'flex' }} ref={ref}>
        {state.segments.map((segment, i) => (
          <DateSegment key={i} segment={segment} state={state} />
        ))}
      </div>
    )
  },
)

SingleDateField.displayName = 'SingleDateField'
