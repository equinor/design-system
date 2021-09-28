import React, { useState, useCallback, createRef } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import enGb from 'date-fns/locale/en-GB'
import styled from 'styled-components'
import { Icon } from '../Icon'
import { calendar } from '@equinor/eds-icons'
import { PopupHeader } from './PopupHeader'

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

const ReactDatePicker: React.FC<DatePickerProps> = ({
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
}) => {
  const ref = createRef<DatePicker | undefined>()
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
          ref?.current?.setOpen(true)
        }}
      >
        {label}
        <CalendarIcon
          name="calendar"
          className="calendar-icon"
          data={calendar}
          size={24}
        />
      </DateLabel>
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
          ref?.current?.setOpen(false)
        }}
        autoComplete="false"
        popperPlacement={popperPlacement}
        renderCustomHeader={(props) => (
          <PopupHeader {...props} changeDate={onDateValueChange} />
        )}
        shouldCloseOnSelect={true}
        readOnly={readOnly}
      />
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  .react-datepicker {
    font-family: Equinor !important;
  }
  .react-datepicker__header {
    background-color: white;
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
  font-family: Equinor;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.333em;
  text-align: left;
  color: #6f6f6f;
  margin-bottom: 0px;
  padding: 0 8px;
  position: relative;
`

const CalendarIcon = styled(Icon)`
  position: absolute;
  right: 15px;
  bottom: -26px;
  z-index: 1;
  width: 18px;
  height: 18px;
  color: #616161;
  cursor: pointer;
`

const StyledDatepicker = styled(DatePicker)`
  background-color: rgba(247, 247, 247, 1) !important;
  border-bottom: none !important;
  box-shadow: inset 0 -1px 0 0 #6f6f6f;
  padding: 6px;
  height: 36px;
  width: 100%;
`

export { ReactDatePicker as DatePicker }
