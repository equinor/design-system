import {
  forwardRef,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { DatePickerProps } from './props'
import { Calendar } from './calendars/Calendar'
import { DateField } from './fields/DateField'
import { calendar, warning_outlined } from '@equinor/eds-icons'
import { useCommonHook } from './utils/useCommonHook'
import { FieldWrapper } from './fields/FieldWrapper'
import { Toggle } from './fields/Toggle'
import {
  CalendarDate,
  CalendarDateTime,
  createCalendar,
  fromDate,
  toCalendarDate,
  toCalendarDateTime,
} from '@internationalized/date'
import { useDatePicker, useLocale } from 'react-aria'
import { useDatePickerState } from '@react-stately/datepicker'
import { DatePickerProvider, defaultTimezone } from './utils/context'
import { HelperTextProps } from '../InputWrapper/HelperText'
import { tokens } from '@equinor/eds-tokens'
import { Icon } from '../Icon'

/**
 * DatePicker component encapsulates the logic for selecting a single date.
 * Either by accessible input field or by a calendar.
 */
export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
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
      time,
      ...props
    }: DatePickerProps,
    ref,
  ) => {
    timezone = timezone ?? defaultTimezone
    const [innerValue, setInnerValue] = useState<
      CalendarDate | CalendarDateTime
    >(
      value
        ? time
          ? toCalendarDateTime(fromDate(value, timezone))
          : toCalendarDate(fromDate(value, timezone))
        : null,
    )
    const [open, setOpen] = useState<boolean | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const pickerRef = useRef<HTMLDivElement | null>(null)

    const actualRef = useMemo(() => {
      return (ref || inputRef) as RefObject<HTMLDivElement>
    }, [ref, inputRef])

    const { _minValue, _maxValue, _isDateUnavailable } = useCommonHook(
      minValue,
      maxValue,
      isDateUnavailable,
      timezone,
    )

    const _onChange = useCallback(
      (value: CalendarDate | CalendarDateTime) => {
        if (value) {
          setInnerValue(
            time ? toCalendarDateTime(value) : toCalendarDate(value),
          )
        } else {
          setInnerValue(null)
        }
        if (open) {
          setOpen(false)
        }
        if (onChange) {
          if (!value) {
            onChange(null)
          } else {
            const date = value.toDate(timezone)
            onChange(date)
          }
        }
      },
      [onChange, open, time, timezone],
    )

    const _value = useMemo(() => {
      if (!value) {
        return innerValue
      }
      return time
        ? toCalendarDateTime(fromDate(value, timezone))
        : toCalendarDate(fromDate(value, timezone))
    }, [value, time, timezone, innerValue])

    useEffect(() => {
      if (defaultValue) {
        if (time) {
          setInnerValue(toCalendarDateTime(fromDate(defaultValue, timezone)))
        } else {
          setInnerValue(toCalendarDate(fromDate(defaultValue, timezone)))
        }
      }
      // Disable this rule because we only want to set the defaultValue once
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const { locale } = useLocale()

    const dateCreateProps = useMemo(() => {
      return {
        ...props,
        isDisabled: props.disabled,
        value: _value,
        hideTimeZone: true,
        locale,
        createCalendar,
        onChange: _onChange,
        minValue: _minValue,
        maxValue: _maxValue,
        isDateUnavailable: _isDateUnavailable,
        label,
      }
    }, [
      props,
      _value,
      locale,
      _onChange,
      _minValue,
      _maxValue,
      _isDateUnavailable,
      label,
    ])

    const pickerState = useDatePickerState(dateCreateProps)
    const { groupProps, buttonProps, fieldProps, calendarProps } =
      useDatePicker(dateCreateProps, pickerState, actualRef)

    const helperProps = useMemo<HelperTextProps | undefined>(() => {
      if (pickerState.displayValidation.isInvalid) {
        return {
          text: pickerState.displayValidation.validationErrors.join('\n'),
          color: tokens.colors.interactive.warning__text.rgba,
          icon: <Icon data={warning_outlined} />,
        }
      }
      return undefined
    }, [pickerState.displayValidation])

    return (
      <DatePickerProvider timezone={timezone}>
        <FieldWrapper
          open={open}
          pickerRef={pickerRef}
          ref={actualRef}
          setOpen={setOpen}
          label={label}
          calendar={
            <Calendar
              ref={pickerRef}
              footer={footer}
              Header={Header}
              state={pickerState}
              {...dateCreateProps}
            />
          }
          {...props}
          color={pickerState.isInvalid ? 'warning' : props.variant}
          helperProps={helperProps ?? props.helperProps}
        >
          <DateField
            fieldProps={fieldProps}
            groupProps={groupProps}
            dateCreateProps={dateCreateProps}
            ref={actualRef}
            onChange={_onChange}
            rightAdornments={
              <Toggle
                setOpen={setOpen}
                open={open}
                icon={calendar}
                disabled={calendarProps.isDisabled}
                reset={() => _onChange(null)}
                buttonProps={buttonProps}
                valueString={pickerState.formatValue(locale, {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                })}
              />
            }
            variant={props.variant}
          />
        </FieldWrapper>
      </DatePickerProvider>
    )
  },
)

DatePicker.displayName = 'DatePicker'
