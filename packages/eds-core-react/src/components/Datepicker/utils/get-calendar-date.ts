import {
  fromDate,
  toCalendarDate,
  toCalendarDateTime,
} from '@internationalized/date'

export const getCalendarDate = (
  value: Date,
  timezone: string,
  showTimeInput = false,
) => {
  if (!value) return null
  return showTimeInput
    ? toCalendarDateTime(fromDate(value, timezone))
    : toCalendarDate(fromDate(value, timezone))
}
