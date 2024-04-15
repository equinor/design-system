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
  const _minValue = useMemo(() => {
    return minValue ? toCalendarDate(fromDate(minValue, tz)) : undefined
  }, [tz, minValue])
  const _maxValue = useMemo(() => {
    return maxValue ? toCalendarDate(fromDate(maxValue, tz)) : undefined
  }, [tz, maxValue])
  const _minTimeValue = useMemo(() => {
    return minValue ? fromDate(minValue, tz) : undefined
  }, [tz, minValue])
  const _maxTimeValue = useMemo(() => {
    return maxValue ? fromDate(maxValue, tz) : undefined
  }, [tz, maxValue])

  const _isDateUnavailable = useCallback(
    (value: DateValue) => {
      return isDateUnavailable ? isDateUnavailable(value.toDate(tz)) : false
    },
    [tz, isDateUnavailable],
  )

  return {
    _minValue,
    _maxValue,
    _isDateUnavailable,
    _minTimeValue,
    _maxTimeValue,
  }
}
