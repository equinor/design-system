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
import { useCommonHook } from './utils/useCommonHook'
import { FieldWrapper } from './fields/FieldWrapper'
import { Toggle } from './fields/Toggle'
import { DateValue, useDateRangePicker } from 'react-aria'
import {
  DateRangePickerStateOptions,
  useDateRangePickerState,
} from '@react-stately/datepicker'
import { DateRangeField } from './fields/DateRangeField'
import { RangeValue } from './utils/types'
import { fromDate, toCalendarDate } from '@internationalized/date'
import { DatePickerProvider, defaultTimezone } from './utils/context'
import { HelperTextProps } from '../InputWrapper/HelperText'
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
    fwdRef,
  ) => {
    timezone = timezone ?? defaultTimezone
    const [innerValue, setInnerValue] = useState<RangeValue<DateValue>>()
    const [open, setOpen] = useState<boolean | null>(null)
    const inputRef = useRef(null)
    const pickerRef = useRef(null)
    const ref = useMemo(() => {
      return (fwdRef || inputRef) as RefObject<HTMLDivElement>
    }, [fwdRef, inputRef])

    const { _minValue, _maxValue, _isDateUnavailable } = useCommonHook(
      minValue,
      maxValue,
      isDateUnavailable,
      timezone,
    )

    const _onChange = useCallback(
      (r: RangeValue<DateValue> | undefined | null) => {
        setInnerValue(r)
        if (open) {
          setOpen(false)
        }
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

    const dateRangePickerStateProps =
      useMemo<DateRangePickerStateOptions>(() => {
        return {
          maxValue: _maxValue,
          minValue: _minValue,
          isDateUnavailable: _isDateUnavailable,
          onChange: _onChange,
          label: label,
          value: _value,
          isDisabled: props.disabled,
        }
      }, [
        _isDateUnavailable,
        _maxValue,
        _minValue,
        label,
        _onChange,
        _value,
        props.disabled,
      ])

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

    const helperProps = useMemo<HelperTextProps | undefined>(() => {
      if (state.displayValidation.isInvalid) {
        return {
          text: state.displayValidation.validationErrors.join('\n'),
          color: tokens.colors.interactive.warning__text.rgba,
          icon: <Icon data={warning_outlined} />,
        }
      }
      return undefined
    }, [state.displayValidation])

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
                  if (onChange) onChange(null)
                }}
                setOpen={setOpen}
                open={open}
                icon={calendar_date_range}
              />
            }
          />
        </FieldWrapper>
      </DatePickerProvider>
    )
  },
)

DateRangePicker.displayName = 'DateRangePicker'