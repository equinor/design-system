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
import { forwardRef, ReactNode, RefObject, useState } from 'react'
import { CalendarHeader } from './CalendarHeader'
import { HeaderFooterProps } from '../props'
import { Popover } from '../../Popover'
import { CalendarWrapper } from './CalendarWrapper'

/**
 * RangeCalendar is the inline calendar picker used in {@link DateRangePicker}.
 * It allows for selecting a range of dates.
 */
export const RangeCalendar = forwardRef(
  (
    {
      Header,
      Footer,
      ...props
    }: Partial<
      AriaRangeCalendarProps<DateValue> & {
        Footer?: (props: HeaderFooterProps) => ReactNode
        Header?: (props: HeaderFooterProps) => ReactNode
      }
    >,
    ref: RefObject<HTMLDivElement>,
  ) => {
    const [showYearPicker, setShowYearPicker] = useState(false)
    const [yearPickerPage, setYearPickerPage] = useState(0)

    const { locale } = useLocale()
    const state = useRangeCalendarState({
      ...props,
      locale,
      createCalendar,
    })

    const { calendarProps, title } = useRangeCalendar(props, state, ref)

    return (
      <CalendarWrapper {...calendarProps} ref={ref}>
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
            <CalendarHeader
              state={state}
              title={title}
              setShowYearPicker={setShowYearPicker}
              showYearPicker={showYearPicker}
              setYearPickerPage={setYearPickerPage}
            />
          )}
        </Popover.Header>
        <Popover.Content>
          <CalendarGrid
            state={state}
            setShowYearPicker={setShowYearPicker}
            showYearPicker={showYearPicker}
            yearPickerPage={yearPickerPage}
            setYearPickerPage={setYearPickerPage}
          />
        </Popover.Content>
        {Footer && (
          <Popover.Actions>
            <Footer
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
          </Popover.Actions>
        )}
      </CalendarWrapper>
    )
  },
)

RangeCalendar.displayName = 'RangeCalendar'
