/* eslint-disable react/no-array-index-key */
import { CalendarState, RangeCalendarState } from '@react-stately/calendar'
import { AriaCalendarGridProps, useCalendarGrid } from 'react-aria'
import { CalendarCell } from './CalendarCell'
import { YearGrid } from './YearGrid'
import { Dispatch, SetStateAction } from 'react'

/**
 * The grid laying out the cells for the calendars in {link Calendar} and {link RangeCalendar}
 */
export function CalendarGrid({
  state,
  showYearPicker,
  setShowYearPicker,
  yearPickerPage,
  setYearPickerPage,
  ...props
}: {
  state: CalendarState | RangeCalendarState
  showYearPicker: boolean
  setShowYearPicker: (showYearPicker: boolean) => void
  yearPickerPage: number
  setYearPickerPage: Dispatch<SetStateAction<number>>
} & AriaCalendarGridProps) {
  const { gridProps, headerProps, weekDays } = useCalendarGrid(
    { ...props, weekdayStyle: 'long' },
    state,
  )

  // Always render 6 rows (the maximum weeks in any month) so the calendar
  // height stays consistent when navigating between months.
  const weeksInMonthArray = [...new Array(6).keys()]

  return showYearPicker ? (
    <YearGrid
      year={state.focusedDate.year}
      setFocusedYear={(year) => {
        state.setFocusedDate(state.focusedDate.set({ year }))
        setShowYearPicker(false)
      }}
      yearPickerPage={yearPickerPage}
      setYearPickerPage={setYearPickerPage}
    />
  ) : (
    <table {...gridProps} style={{ borderSpacing: '0px' }}>
      <thead {...headerProps}>
        <tr>
          {weekDays.map((day, index) => (
            <th
              style={{ textAlign: 'center' }}
              key={`${day}-${index}`}
              abbr={day}
            >
              {day.charAt(0).toLocaleUpperCase()}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeksInMonthArray.map((weekIndex) => (
          <tr key={weekIndex}>
            {state
              .getDatesInWeek(weekIndex)
              .map((date, i) =>
                date ? (
                  <CalendarCell
                    key={date.toString()}
                    state={state}
                    date={date}
                  />
                ) : (
                  <td key={`placeholder-${i}`} />
                ),
              )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
