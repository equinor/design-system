import { forwardRef, RefObject, useCallback, useRef, useState } from 'react'
import { DatePickerProps } from './props'
import { Calendar } from './calendars/Calendar'
import { DateField } from './fields/DateField'
import { calendar, warning_outlined } from '@equinor/eds-icons'
import { useConvertedValidationFunctions } from './utils/useConvertedValidationFunctions'
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
import { tokens } from '@equinor/eds-tokens'
import { Icon } from '../Icon'
import { getCalendarDate } from './utils/get-calendar-date'

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
      Footer,
      Header,
      timezone,
      defaultValue,
      showTimeInput,
      granularity,
      disabled: isDisabled,
      readOnly: isReadOnly,
      ...props
    }: DatePickerProps,
    forwardedRef: RefObject<HTMLDivElement>,
  ) => {
    timezone = timezone ?? defaultTimezone
    const [innerValue, setInnerValue] = useState<
      CalendarDate | CalendarDateTime
    >(() => {
      const initialValue = value ?? defaultValue
      if (initialValue) {
        if (showTimeInput) {
          return toCalendarDateTime(fromDate(initialValue, timezone))
        } else {
          return toCalendarDate(fromDate(initialValue, timezone))
        }
      }
      return null
    })
    const [isOpen, setIsOpen] = useState<boolean | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const pickerRef = useRef<HTMLDivElement | null>(null)

    const ref = forwardedRef || inputRef

    const { _minValue, _maxValue, _isDateUnavailable } =
      useConvertedValidationFunctions(
        minValue,
        maxValue,
        isDateUnavailable,
        timezone,
      )

    const _onChange = useCallback(
      (value: CalendarDate | CalendarDateTime) => {
        // Set internal value
        if (value) {
          setInnerValue(
            showTimeInput ? toCalendarDateTime(value) : toCalendarDate(value),
          )
        } else {
          setInnerValue(null)
        }
        // Close the picker after selecting a date
        if (isOpen) {
          setIsOpen(false)
        }
        // Call onChange callback from props
        if (onChange) {
          if (!value) {
            onChange(null)
          } else {
            const date = value.toDate(timezone)
            onChange(date)
          }
        }
      },
      [onChange, isOpen, showTimeInput, timezone],
    )

    const _value = getCalendarDate(value, timezone, showTimeInput) ?? innerValue

    const { locale } = useLocale()

    const dateCreateProps = {
      ...props,
      isDisabled,
      value: _value,
      hideTimeZone: true,
      locale,
      createCalendar,
      onChange: _onChange,
      minValue: _minValue,
      maxValue: _maxValue,
      isDateUnavailable: _isDateUnavailable,
      label: label || 'Date picker',
      isReadOnly,
      granularity,
    }

    const pickerState = useDatePickerState(dateCreateProps)
    const { groupProps, buttonProps, fieldProps, calendarProps } =
      useDatePicker(dateCreateProps, pickerState, ref)

    const helperProps = pickerState.displayValidation.isInvalid
      ? {
          text: pickerState.displayValidation.validationErrors.join('\n'),
          color: tokens.colors.interactive.warning__text.rgba,
          icon: <Icon data={warning_outlined} />,
        }
      : undefined

    return (
      <DatePickerProvider timezone={timezone}>
        <FieldWrapper
          isOpen={isOpen}
          readonly={fieldProps.isReadOnly}
          pickerRef={pickerRef}
          ref={ref}
          setIsOpen={setIsOpen}
          label={label}
          calendar={
            <Calendar
              ref={pickerRef}
              Footer={Footer}
              Header={Header}
              {...calendarProps}
            />
          }
          disabled={isDisabled}
          readOnly={isReadOnly}
          color={pickerState.isInvalid ? 'warning' : props.variant}
          helperProps={helperProps ?? props.helperProps}
        >
          <DateField
            fieldProps={fieldProps}
            groupProps={groupProps}
            dateCreateProps={dateCreateProps}
            ref={ref}
            onChange={_onChange}
            rightAdornments={
              <Toggle
                setOpen={setIsOpen}
                open={isOpen}
                icon={calendar}
                disabled={isDisabled}
                readonly={isReadOnly}
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
