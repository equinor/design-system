import {
  forwardRef,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { DateRangePickerProps } from './props'
import { RangeCalendar } from './calendars/RangeCalendar'
import { calendar_date_range, warning_outlined } from '@equinor/eds-icons'
import { useConvertedValidationFunctions } from './utils/useConvertedValidationFunctions'
import { FieldWrapper } from './fields/FieldWrapper'
import { Toggle } from './fields/Toggle'
import { DateValue, useDateRangePicker, useLocale } from 'react-aria'
import { useDateRangePickerState } from '@react-stately/datepicker'
import { DateRangeField } from './fields/DateRangeField'
import { RangeValue } from './utils/types'
import { fromDate, toCalendarDate } from '@internationalized/date'
import { DatePickerProvider, defaultTimezone } from './utils/context'
import { tokens } from '@equinor/eds-tokens'
import { Icon } from '../Icon'

/**
 * DateRangePicker component encapsulates the logic for selecting a range of dates
 * Either by accessible input fields or by a calendar.
 */
export const DateRangePicker = forwardRef(
  (
    {
      onChange,
      label,
      value,
      isDateUnavailable,
      minValue,
      maxValue,
      footer,
      Header,
      timezone,
      defaultValue,
      ...props
    }: DateRangePickerProps,
    forwardedRef,
  ) => {
    timezone = timezone ?? defaultTimezone
    const [innerValue, setInnerValue] = useState<RangeValue<DateValue>>()
    const [open, setOpen] = useState<boolean | null>(null)
    const inputRef = useRef(null)
    const pickerRef = useRef(null)
    const ref = (forwardedRef || inputRef) as RefObject<HTMLDivElement>
    const { locale } = useLocale()

    const { _minValue, _maxValue, _isDateUnavailable } =
      useConvertedValidationFunctions(
        minValue,
        maxValue,
        isDateUnavailable,
        timezone,
      )

    const _onChange = useCallback(
      (r: RangeValue<DateValue> | undefined | null) => {
        setInnerValue(r)
        // Close picker on selecting date
        if (open) {
          setOpen(false)
        }
        // Propagate change
        if (onChange) {
          if (!r) onChange(null)
          else {
            onChange({
              from: r.start?.toDate(timezone) ?? null,
              to: r.end?.toDate(timezone) ?? null,
            })
          }
        }
      },
      [onChange, open, timezone],
    )

    const _value = useMemo<RangeValue<DateValue>>(() => {
      if (!value) return innerValue
      return {
        start: value.from
          ? toCalendarDate(fromDate(value.from, timezone))
          : null,
        end: value.to ? toCalendarDate(fromDate(value.to, timezone)) : null,
      }
    }, [innerValue, timezone, value])

    const dateRangePickerStateProps = {
      maxValue: _maxValue,
      minValue: _minValue,
      isDateUnavailable: _isDateUnavailable,
      onChange: _onChange,
      label: label,
      value: _value,
      isDisabled: props.disabled,
    }

    useEffect(() => {
      if (defaultValue) {
        setInnerValue({
          start: toCalendarDate(fromDate(defaultValue?.from, timezone)),
          end: toCalendarDate(fromDate(defaultValue?.to, timezone)),
        })
      }
      // Disable this rule because we only want to set the defaultValue once
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const state = useDateRangePickerState(dateRangePickerStateProps)
    const {
      groupProps,
      startFieldProps,
      endFieldProps,
      buttonProps,
      calendarProps,
    } = useDateRangePicker(dateRangePickerStateProps, state, ref)

    const helperProps = state.displayValidation.isInvalid
      ? {
          text: state.displayValidation.validationErrors.join('\n'),
          color: tokens.colors.interactive.warning__text.rgba,
          icon: <Icon data={warning_outlined} />,
        }
      : undefined

    const valueString = useMemo(() => {
      const value = state.formatValue(locale, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      })
      if (!value) return null
      return Object.values(value).join(' - ')
    }, [state, locale])

    return (
      <DatePickerProvider timezone={timezone}>
        <FieldWrapper
          open={open}
          color={state.isInvalid ? 'warning' : props.variant}
          helperProps={helperProps ?? props.helperProps}
          ref={ref}
          pickerRef={pickerRef}
          setOpen={setOpen}
          label={label}
          calendar={
            <RangeCalendar
              ref={pickerRef}
              maxValue={_maxValue}
              minValue={_minValue}
              isDateUnavailable={_isDateUnavailable}
              footer={footer}
              Header={Header}
              {...calendarProps}
            />
          }
        >
          <DateRangeField
            startFieldProps={startFieldProps}
            endFieldProps={endFieldProps}
            groupProps={groupProps}
            ref={ref}
            variant={props.variant}
            disabled={props.disabled}
            rightAdornments={
              <Toggle
                buttonProps={buttonProps}
                disabled={props.disabled}
                reset={() => {
                  _onChange(null)
                }}
                setOpen={setOpen}
                open={open}
                icon={calendar_date_range}
                valueString={valueString}
              />
            }
          />
        </FieldWrapper>
      </DatePickerProvider>
    )
  },
)

DateRangePicker.displayName = 'DateRangePicker'
