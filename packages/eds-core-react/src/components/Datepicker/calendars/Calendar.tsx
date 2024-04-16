import { useCalendar, useLocale } from 'react-aria'
import { forwardRef, ReactNode, RefObject, useEffect, useState } from 'react'
import { CalendarStateOptions, useCalendarState } from '@react-stately/calendar'

import { CalendarGrid } from './CalendarGrid'
import { CalendarHeader } from './CalendarHeader'
import { HeaderProps } from '../props'
import { DatePickerState } from '@react-stately/datepicker'
import {
  CalendarDate,
  CalendarDateTime,
  createCalendar,
  toCalendarDate,
} from '@internationalized/date'
import { Popover } from '../../Popover'

/**
 * Calendar is the inline calendar picker used in {@link DatePicker}.
 * It only allows selecting a single date
 */
export const Calendar = forwardRef(
  (
    {
      Header,
      footer,
      state,
      ...props
    }: {
      /**
       * Custom header component
       */
      Header?: (props: HeaderProps) => ReactNode
      /**
       * Custom footer component
       */
      footer?: ReactNode
      /**
       * The calendar state from react-aria
       */
      state: DatePickerState
    } & CalendarStateOptions<CalendarDate | CalendarDateTime>,
    ref,
  ) => {
    const [showYearPicker, setShowYearPicker] = useState(false)
    const { locale } = useLocale()
    const calendarState = useCalendarState({
      ...props,
      locale,
      createCalendar,
    })

    const { calendarProps, prevButtonProps, nextButtonProps, title } =
      useCalendar(props, calendarState)

    useEffect(() => {
      if (state.value) {
        calendarState.setFocusedDate(toCalendarDate(state.value))
      }
      // We don't want to trigger an update when the state changes (spoiler alert: the state changes every time focus changes)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.value])

    return (
      <>
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
            />
          )}
        </Popover.Header>
        <Popover.Content
          {...calendarProps}
          className="calendar"
          style={{ height: 'fit-content' }}
          ref={ref as RefObject<HTMLDivElement>}
        >
          <CalendarGrid
            state={calendarState}
            setShowYearPicker={setShowYearPicker}
            showYearPicker={showYearPicker}
          />
        </Popover.Content>
        {footer && <Popover.Actions>{footer}</Popover.Actions>}
      </>
    )
  },
)

Calendar.displayName = 'Calendar'
