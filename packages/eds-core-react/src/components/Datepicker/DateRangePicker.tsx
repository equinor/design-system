import {
  forwardRef,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { DateRangePickerProps } from './props'
import { RangeCalendar } from './calendars/RangeCalendar'
import { calendar_date_range, warning_outlined } from '@equinor/eds-icons'
import { useConvertedValidationFunctions } from './utils/useConvertedValidationFunctions'
import { FieldWrapper } from './fields/FieldWrapper'
import { Toggle } from './fields/Toggle'
import { DateValue, I18nProvider, useDateRangePicker } from 'react-aria'
import {
  DateRangePickerStateOptions,
  useDateRangePickerState,
} from '@react-stately/datepicker'
import { DateRangeField } from './fields/DateRangeField'
import { RangeValue } from './utils/types'
import { fromDate, toCalendarDate } from '@internationalized/date'
import { DatePickerProvider, defaultTimezone } from './utils/context'
import { tokens } from '@equinor/eds-tokens'
import { Icon } from '../Icon'
import { getCalendarDate } from './utils/get-calendar-date'
import { useGetLocale } from './utils/useGetLocale'

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
      Footer,
      Header,
      timezone,
      defaultValue,
      locale: propLocale,
      formatOptions,
      hideClearButton,
      disabled: isDisabled,
      readOnly: isReadOnly,
      ...props
    }: DateRangePickerProps,
    forwardedRef: RefObject<HTMLDivElement>,
  ) => {
    timezone = timezone ?? defaultTimezone
    formatOptions = formatOptions ?? {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }
    const [innerValue, setInnerValue] = useState<RangeValue<DateValue>>(() => {
      const initialValue = value ?? defaultValue
      if (initialValue) {
        return {
          start: initialValue.from
            ? toCalendarDate(fromDate(initialValue.from, timezone))
            : null,
          end: initialValue.to
            ? toCalendarDate(fromDate(initialValue.to, timezone))
            : null,
        }
      }
    })
    const [isOpen, setIsOpen] = useState<boolean | null>(null)
    const inputRef = useRef(null)
    const pickerRef = useRef(null)
    const ref = forwardedRef || inputRef
    const locale = useGetLocale(propLocale)

    const { _minValue, _maxValue, _isDateUnavailable } =
      useConvertedValidationFunctions(
        minValue,
        maxValue,
        isDateUnavailable,
        timezone,
      )

    const _onChange = useCallback(
      (rangeValue: RangeValue<DateValue> | undefined | null) => {
        setInnerValue(rangeValue)
        // Close picker on selecting date
        if (isOpen) {
          setIsOpen(false)
        }
        // Propagate change
        if (onChange) {
          if (!rangeValue) onChange(null)
          else {
            onChange({
              from: rangeValue.start?.toDate(timezone) ?? null,
              to: rangeValue.end?.toDate(timezone) ?? null,
            })
          }
        }
      },
      [onChange, isOpen, timezone],
    )

    const _value = value
      ? {
          start: getCalendarDate(value.from, timezone),
          end: getCalendarDate(value.to, timezone),
        }
      : innerValue

    const dateRangePickerStateProps: DateRangePickerStateOptions = {
      maxValue: _maxValue,
      minValue: _minValue,
      isDateUnavailable: _isDateUnavailable,
      onChange: _onChange,
      label: label ?? 'Date-range',
      value: _value,
      isDisabled: isDisabled,
      isReadOnly: isReadOnly,
    }

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
          icon: <Icon size={16} data={warning_outlined} />,
        }
      : undefined

    const showClearButton = state.dateRange !== null && !hideClearButton

    const formattedValue = state.formatValue(locale, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    })
    const valueString = formattedValue
      ? Object.values(formattedValue).join(' - ')
      : null

    // innerValue is used as a fallback, especially for uncontrolled inputs, so it needs to be reset when value / defaultValue is reset
    useEffect(() => {
      const val = defaultValue ?? value
      if (!defaultValue && !value) setInnerValue(null)
      if (!val?.from && !val?.to) setInnerValue(null)
    }, [defaultValue, value])

    return (
      <I18nProvider locale={locale}>
        <DatePickerProvider timezone={timezone} formatOptions={formatOptions}>
          <FieldWrapper
            {...props}
            isOpen={isOpen}
            color={state.isInvalid ? 'warning' : props.variant}
            helperProps={helperProps ?? props.helperProps}
            readonly={startFieldProps.isReadOnly}
            ref={ref}
            pickerRef={pickerRef}
            setIsOpen={setIsOpen}
            label={label}
            calendar={
              <RangeCalendar
                ref={pickerRef}
                maxValue={_maxValue}
                minValue={_minValue}
                isDateUnavailable={_isDateUnavailable}
                Footer={Footer}
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
              disabled={isDisabled}
              locale={locale}
              rightAdornments={
                <Toggle
                  showClearButton={showClearButton}
                  buttonProps={buttonProps}
                  disabled={isDisabled}
                  readonly={isReadOnly}
                  reset={() => {
                    _onChange(null)
                  }}
                  setOpen={setIsOpen}
                  open={isOpen}
                  icon={calendar_date_range}
                  valueString={valueString}
                />
              }
            />
          </FieldWrapper>
        </DatePickerProvider>
      </I18nProvider>
    )
  },
)

DateRangePicker.displayName = 'DateRangePicker'
