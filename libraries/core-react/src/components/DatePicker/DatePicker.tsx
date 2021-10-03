import React, { useState, useCallback, forwardRef } from 'react'
import DatePicker, {
  ReactDatePickerProps,
  registerLocale,
} from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import enGb from 'date-fns/locale/en-GB'
import styled from 'styled-components'
import { Icon } from '../Icon'
import { calendar } from '@equinor/eds-icons'
import { PopupHeader } from './PopupHeader'
import { datePicker as tokens, DatePickerToken } from './DatePicker.tokens'

registerLocale('en-gb', enGb)

export interface DatePickerProps {
  id: string
  value: Date | undefined | null
  label: string
  onChanged?: (date: Date | null) => void
  disableFuture?: boolean
  disableBeforeDate?: Date
  className?: string
  dateFormat?: string
  placeholder?: string
  readOnly?: boolean
  popperPlacement?:
    | 'auto-start'
    | 'auto'
    | 'auto-end'
    | 'top-start'
    | 'top'
    | 'top-end'
    | 'right-start'
    | 'right'
    | 'right-end'
    | 'bottom-end'
    | 'bottom'
    | 'bottom-start'
    | 'left-end'
    | 'left'
    | 'left-start'
  locale?: string
}

export interface DatePickerRefProps extends ReactDatePickerProps {
  setBlur: () => void
  setFocus: () => void
  setOpen: (open: boolean, skipSetBlur?: boolean) => void
  isCalendarOpen: () => boolean
}

const ReactDatePicker = forwardRef<DatePickerRefProps, DatePickerProps>(
  function DatePicker(
    {
      label,
      value,
      onChanged,
      id,
      disableFuture,
      disableBeforeDate,
      className,
      dateFormat = 'dd.MM.yyyy',
      placeholder = 'DD.MM.YYYY',
      readOnly = false,
      popperPlacement,
      locale = 'en-gb',
    },
    ref,
  ) {
    const [date, setDate] = useState(value)
    const onDateValueChange = useCallback(
      (date: Date): void => {
        setDate(date)
        onChanged?.(date)
      },
      [onChanged],
    )

    return (
      <Container className={`date-picker ${className}`}>
        <DateLabel
          htmlFor={id}
          className={`date-label`}
          onClick={(): void => {
            ref?.setOpen?.(true)
          }}
        >
          <span>{label}</span>
          <StyledDatepicker
            ref={ref}
            locale={locale}
            selected={date}
            onChange={onDateValueChange}
            dateFormat={dateFormat}
            placeholderText={placeholder}
            id={id}
            filterDate={(date: Date): boolean => {
              if (disableFuture) {
                return new Date() > date
              }
              if (disableBeforeDate) {
                return date >= disableBeforeDate
              }
              return true
            }}
            onChangeRaw={(): void => {
              ref?.setOpen?.(false)
            }}
            autoComplete="false"
            popperPlacement={popperPlacement}
            renderCustomHeader={(props) => (
              <PopupHeader {...props} changeDate={onDateValueChange} />
            )}
            shouldCloseOnSelect={true}
            readOnly={readOnly}
          />
          <CalendarIcon
            name="calendar"
            className="calendar-icon"
            data={calendar}
            size={24}
          />
        </DateLabel>
      </Container>
    )
  },
)
console.log('tokens ---> ', tokens)

const Container = styled.div.attrs<DatePickerToken>(tokens)`
  width: ${tokens.width};
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;

  .react-datepicker {
    font-family: ${tokens.entities.title.typography.fontFamily} !important;
  }
  .react-datepicker__month-container {
    -width: ${tokens.width};
  }
  .react-datepicker__header {
    background-color: ${tokens.background};
    border-bottom: none;
  }
  .react-datepicker__current-month {
    font-weight: 500;
  }
  .react-datepicker__day-names {
    border-top: 1px solid #ececec;
    margin: 10px 0 0 0;
    padding: 10px 0 0 0;
    text-align: center;
  }
  .react-datepicker__day-name {
    color: #6f6f6f;
    font-size: 11px;
    visibility: hidden;
    line-height: unset;
    width: 35px;
  }
  .react-datepicker__day-name:first-letter {
    visibility: visible;
  }
  .react-datepicker__day {
    color: #007079;
    font-weight: 500;
    width: 35px;
    line-height: 35px;
  }
  .react-datepicker__day--selected,
  .react-datepicker__month-text--keyboard-selected,
  .react-datepicker__quarter-text--keyboard-selected,
  .react-datepicker__year-text--keyboard-selected {
    background-color: #007079;
    color: white;
  }
  .react-datepicker__day--keyboard-selected {
    background-color: unset;
  }
  .react-datepicker__day--disabled {
    color: #ccc;
  }
  .react-datepicker-popper {
    z-index: 4 !important;
  }
`

const DateLabel = styled.label`
  position: relative;
  color: ${tokens.entities.label.typography.color};
  font-family: ${tokens.entities.label.typography.fontFamily};
  font-size: ${tokens.entities.label.typography.fontSize};
  line-height: ${tokens.entities.label.typography.lineHeight};

  span {
    padding-left: 8px;
  }
`

const StyledDatepicker = styled(DatePicker)`
  height: 24px;
  font-family: ${tokens.entities.title.typography.fontFamily};
  font-size: ${tokens.entities.title.typography.fontSize};
  color: ${tokens.entities.title.typography.color};
  line-height: ${tokens.entities.title.typography.lineHeight};
  box-shadow: inset 0 -1px 0 0 #6f6f6f;
  background-color: ${tokens.background};
  border: none;
  padding: 6px;
  width: 100%;
  max-width: ${tokens.width};
  border-radius: 0%;

  &:focus {
    border-radius: none;
    outline: 2px solid ${tokens.colors.green100};
  }
`

const CalendarIcon = styled(Icon)`
  position: absolute;
  z-index: 1;
  width: 18px;
  height: 18px;
  top: ${tokens.spacings.top};
  right: 6px;
  color: ${tokens.entities.title.typography.color};
  cursor: pointer;
`

export { ReactDatePicker as DatePicker }
