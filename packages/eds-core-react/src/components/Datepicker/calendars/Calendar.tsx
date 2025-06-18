import {
  AriaCalendarProps,
  DateValue,
  useCalendar,
  useLocale,
} from 'react-aria'
import { forwardRef, ReactNode, RefObject, useState } from 'react'
import { useCalendarState } from '@react-stately/calendar'

import { CalendarGrid } from './CalendarGrid'
import { CalendarHeader } from './CalendarHeader'
import { HeaderFooterProps } from '../props'
import { createCalendar } from '@internationalized/date'
import { Popover } from '../../Popover'
import { CalendarWrapper } from './CalendarWrapper'

/**
 * Calendar is the inline calendar picker used in {@link DatePicker}.
 * It only allows selecting a single date
 */
export const Calendar = forwardRef(
  (
    {
      Header,
      Footer,
      ...props
    }: {
      /**
       * Custom header component
       */
      Header?: (props: HeaderFooterProps) => ReactNode
      /**
       * Custom footer component
       */
      Footer?: (props: HeaderFooterProps) => ReactNode
    } & AriaCalendarProps<DateValue>,
    ref: RefObject<HTMLDivElement>,
  ) => {
    const [showYearPicker, setShowYearPicker] = useState(false)
    const [yearPickerPage, setYearPickerPage] = useState(0)

    const { locale } = useLocale()
    const calendarState = useCalendarState({
      ...props,
      locale,
      createCalendar,
    })

    const { calendarProps, prevButtonProps, nextButtonProps, title } =
      useCalendar(props, calendarState)

    return (
      <CalendarWrapper ref={ref} {...calendarProps}>
        <Popover.Header style={{ width: '100%' }}>
          {Header ? (
            <Header
              month={calendarState.focusedDate.month}
              state={calendarState}
              setMonth={(month) =>
                calendarState.setFocusedDate(
                  calendarState.focusedDate.set({ month }),
                )
              }
              setYear={(year) =>
                calendarState.setFocusedDate(
                  calendarState.focusedDate.set({ year }),
                )
              }
              year={calendarState.focusedDate.year}
            />
          ) : (
            <CalendarHeader
              state={calendarState}
              title={title}
              previousMonthDisabled={prevButtonProps.isDisabled}
              nextMonthDisabled={nextButtonProps.isDisabled}
              setShowYearPicker={setShowYearPicker}
              showYearPicker={showYearPicker}
              yearPickerPage={yearPickerPage}
              setYearPickerPage={setYearPickerPage}
            />
          )}
        </Popover.Header>
        <Popover.Content className="calendar" style={{ height: 'fit-content' }}>
          <CalendarGrid
            state={calendarState}
            setShowYearPicker={setShowYearPicker}
            showYearPicker={showYearPicker}
            yearPickerPage={yearPickerPage}
            setYearPickerPage={setYearPickerPage}
          />
        </Popover.Content>
        {Footer && (
          <Popover.Actions>
            <Footer
              month={calendarState.focusedDate.month}
              state={calendarState}
              setMonth={(month) =>
                calendarState.setFocusedDate(
                  calendarState.focusedDate.set({ month }),
                )
              }
              setYear={(year) =>
                calendarState.setFocusedDate(
                  calendarState.focusedDate.set({ year }),
                )
              }
              year={calendarState.focusedDate.year}
            />
          </Popover.Actions>
        )}
      </CalendarWrapper>
    )
  },
)

Calendar.displayName = 'Calendar'
