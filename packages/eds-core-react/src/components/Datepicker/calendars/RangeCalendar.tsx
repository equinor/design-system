import {
  AriaRangeCalendarProps,
  DateValue,
  useLocale,
  useRangeCalendar,
} from 'react-aria'
import { useRangeCalendarState } from '@react-stately/calendar'
import { createCalendar } from '@internationalized/date'

// Reuse the Button from your component library. See below for details.
import { CalendarGrid } from './CalendarGrid'
import { forwardRef, ReactNode, RefObject } from 'react'
import { CalendarHeader } from './CalendarHeader'
import { HeaderProps } from '../props'
import { Popover } from '../../Popover'

/**
 * RangeCalendar is the inline calendar picker used in {@link DateRangePicker}.
 * It allows for selecting a range of dates.
 */
export const RangeCalendar = forwardRef(
  (
    {
      Header,
      footer,
      ...props
    }: Partial<
      AriaRangeCalendarProps<DateValue> & {
        footer?: ReactNode
        Header?: (props: HeaderProps) => ReactNode
      }
    >,
    ref,
  ) => {
    const { locale } = useLocale()
    const state = useRangeCalendarState({
      ...props,
      locale,
      createCalendar,
    })

    const { calendarProps, title } = useRangeCalendar(
      props,
      state,
      ref as RefObject<HTMLDivElement>,
    )

    return (
      <>
        <Popover.Header>
          {Header ? (
            <Header
              month={state.focusedDate.month}
              state={state}
              setMonth={(month) =>
                state.setFocusedDate(state.focusedDate.set({ month }))
              }
              setYear={(year) =>
                state.setFocusedDate(state.focusedDate.set({ year }))
              }
              year={state.focusedDate.year}
            />
          ) : (
            <CalendarHeader state={state} title={title} />
          )}
        </Popover.Header>
        <Popover.Content>
          <div
            {...calendarProps}
            ref={ref as RefObject<HTMLDivElement>}
            className="calendar"
          >
            <CalendarGrid state={state} />
          </div>
        </Popover.Content>
        {footer && <Popover.Actions>{footer}</Popover.Actions>}
      </>
    )
  },
)

RangeCalendar.displayName = 'RangeCalendar'
