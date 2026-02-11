// In some cases we need to use the index as key
/* eslint-disable react/no-array-index-key */
import {
  DateFieldState,
  DateFieldStateOptions,
  useDateFieldState,
} from '@react-stately/datepicker'
import { useDateField } from 'react-aria'
import { createCalendar } from '@internationalized/date'
import { DateSegment } from './DateSegment'
import { forwardRef, RefObject } from 'react'

type Props = Partial<DateFieldStateOptions> & {
  // Accept state from parent to support deferred validation
  state?: DateFieldState
}

/**
 * A field that wraps segments for inputting a date / date-time
 */
export const DateFieldSegments = forwardRef(
  (
    { state: externalState, ...props }: Props,
    ref: RefObject<HTMLDivElement | null>,
  ) => {
    // Create own state if not provided (backward compatibility)
    const ownState = useDateFieldState({
      ...props,
      locale: props.locale,
      createCalendar,
    })

    // Use state from parent if provided (supports deferred validation)
    const state = externalState ?? ownState

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
