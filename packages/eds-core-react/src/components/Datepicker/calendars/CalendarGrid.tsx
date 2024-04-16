/* eslint-disable react/no-array-index-key */
import { CalendarState, RangeCalendarState } from '@react-stately/calendar'
import { AriaCalendarGridProps, useCalendarGrid, useLocale } from 'react-aria'
import { getWeeksInMonth } from '@internationalized/date'
import { CalendarCell } from './CalendarCell'
import { YearGrid } from './YearGrid'

/**
 * The grid laying out the cells for the calendars in {link Calendar} and {link RangeCalendar}
 */
export function CalendarGrid({
  state,
  showYearPicker,
  setShowYearPicker,
  ...props
}: {
  state: CalendarState | RangeCalendarState
  showYearPicker: boolean
  setShowYearPicker: (showYearPicker: boolean) => void
} & AriaCalendarGridProps) {
  const { locale } = useLocale()
  const { gridProps, headerProps, weekDays } = useCalendarGrid(
    { ...props, weekdayStyle: 'long' },
    state,
  )

  // Get the number of weeks in the month so that we can render the proper number of rows.
  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale)

  return showYearPicker ? (
    <YearGrid
      year={state.focusedDate.year}
      setFocusedYear={(year) => {
        state.setFocusedDate(state.focusedDate.set({ year }))
        setShowYearPicker(false)
      }}
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
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
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
