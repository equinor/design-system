import { CalendarState, RangeCalendarState } from '@react-stately/calendar'
import { AriaCalendarGridProps, useCalendarGrid, useLocale } from 'react-aria'
import { getWeeksInMonth } from '@internationalized/date'
import { CalendarCell } from './CalendarCell'

/**
 * The grid laying out the cells for the calendars in {link Calendar} and {link RangeCalendar}
 */
export function CalendarGrid({
  state,
  ...props
}: {
  state: CalendarState | RangeCalendarState
} & AriaCalendarGridProps) {
  const { locale } = useLocale()
  const { gridProps, headerProps, weekDays } = useCalendarGrid(props, state)

  // Get the number of weeks in the month so we can render the proper number of rows.
  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale)

  return (
    <table {...gridProps} style={{ borderSpacing: '0px' }}>
      <thead {...headerProps}>
        <tr>
          {weekDays.map((day, index) => (
            // This is just first letter, so there can be conflicts (e.g S for Sunday and Saturday)
            // eslint-disable-next-line react/no-array-index-key
            <th style={{ textAlign: 'center' }} key={`${day}-${index}`}>
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={weekIndex}>
            {state.getDatesInWeek(weekIndex).map((date, i) =>
              date ? (
                <CalendarCell key={date.toString()} state={state} date={date} />
              ) : (
                // There isn't anything better than index to use as a key here.
                // eslint-disable-next-line react/no-array-index-key
                <td key={`placeholder-${i}`} />
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
