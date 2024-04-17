import { useCallback, useMemo } from 'react'
import { fromDate, toCalendarDate } from '@internationalized/date'
import { DateValue } from 'react-aria'
import { defaultTimezone } from './context'

export const useConvertedValidationFunctions = (
  minValue?: Date,
  maxValue?: Date,
  isDateUnavailable?: (v: Date) => boolean,
  timezone?: string,
) => {
  const tz = timezone ?? defaultTimezone
  const _minValue = minValue
    ? toCalendarDate(fromDate(minValue, tz))
    : undefined
  const _maxValue = maxValue
    ? toCalendarDate(fromDate(maxValue, tz))
    : undefined
  const _minTimeValue = minValue ? fromDate(minValue, tz) : undefined
  const _maxTimeValue = maxValue ? fromDate(maxValue, tz) : undefined

  const _isDateUnavailable = (value: DateValue) =>
    isDateUnavailable ? isDateUnavailable(value.toDate(tz)) : false

  return {
    _minValue,
    _maxValue,
    _isDateUnavailable,
    _minTimeValue,
    _maxTimeValue,
  }
}
