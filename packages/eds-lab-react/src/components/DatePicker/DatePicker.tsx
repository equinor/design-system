import {
  useState,
  useCallback,
  forwardRef,
  InputHTMLAttributes,
  useRef,
  useImperativeHandle,
  useEffect,
} from 'react'
import DatePicker, {
  ReactDatePickerCustomHeaderProps,
  registerLocale,
} from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import enGb from 'date-fns/locale/en-GB'
import styled, { css, ThemeProvider } from 'styled-components'
import { calendar } from '@equinor/eds-icons'
import { PopupHeader } from './PopupHeader'
import { datePicker as tokens } from './DatePicker.tokens'
import { outlineTemplate } from '@equinor/eds-utils'
import { Paper, Icon } from '@equinor/eds-core-react'

registerLocale('en-gb', enGb)

export type DatePickerProps = {
  id: string
  dateValue: Date | undefined | null
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
  renderCustomHeader?: (
    params: ReactDatePickerCustomHeaderProps,
  ) => React.ReactNode
} & InputHTMLAttributes<HTMLInputElement>

export type DatePickerRefProps = DatePicker &
  InputHTMLAttributes<HTMLInputElement> & {
    setBlur: () => void
    setFocus: () => void
    setOpen: (open: boolean, skipSetBlur?: boolean) => void
    isCalendarOpen: () => boolean
  }

const ReactDatePicker = forwardRef<DatePickerRefProps, DatePickerProps>(
  function DatePicker(
    {
      label,
      dateValue,
      onChanged,
      id,
      disabled,
      disableFuture,
      disableBeforeDate,
      className,
      dateFormat = 'dd.MM.yyyy',
      placeholder = 'DD.MM.YYYY',
      readOnly = false,
      popperPlacement,
      locale = 'en-gb',
      renderCustomHeader,
    },
    ref,
  ) {
    const [date, setDate] = useState<Date>(dateValue)
    const onDateValueChange = useCallback(
      (date: Date): void => {
        setDate(date)
        onChanged?.(date)
      },
      [onChanged],
    )

    useEffect(() => {
      onDateValueChange(dateValue)
    }, [dateValue, onDateValueChange])

    const localRef = useRef<DatePicker | null>()
    useImperativeHandle(ref, () => localRef.current)

    const customHeader =
      renderCustomHeader ||
      ((props: ReactDatePickerCustomHeaderProps) => (
        <PopupHeader {...props} changeDate={onDateValueChange} />
      ))

    return (
      <ThemeProvider theme={tokens}>
        <Container className={`date-picker ${className}`}>
          <DateLabel htmlFor={id} className={`date-label`}>
            <span>{label}</span>
            <StyledDatepicker
              ref={localRef}
              locale={locale}
              selected={date}
              disabled={disabled}
              className="eds-datepicker"
              calendarClassName="eds-datepicker-calendar"
              onChange={onDateValueChange}
              dateFormat={dateFormat}
              placeholderText={placeholder}
              id={id}
              onKeyDown={(event) => {
                // If you shift-tab while focusing the input-element, it should close the pop-over.
                // Not currently supported by react-datepicker.
                if (
                  event.code === 'Tab' &&
                  event.shiftKey &&
                  (event.target as HTMLElement).nodeName == 'INPUT'
                ) {
                  localRef.current?.setOpen(false)
                }
              }}
              filterDate={(date: Date): boolean => {
                if (disableFuture) {
                  return new Date() > date
                }
                if (disableBeforeDate) {
                  return date >= disableBeforeDate
                }
                return true
              }}
              autoComplete="false"
              popperPlacement={popperPlacement}
              renderCustomHeader={customHeader}
              shouldCloseOnSelect={true}
              readOnly={readOnly}
              calendarContainer={({ children, ...rest }) => (
                <Paper
                  {...rest}
                  elevation="temporary_nav"
                  style={{ maxWidth: '312px' }}
                >
                  {children}
                </Paper>
              )}
            />
            <CalendarIcon
              name="calendar"
              className="calendar-icon"
              color={tokens.colors.iconGray}
              data={calendar}
              size={24}
            />
          </DateLabel>
        </Container>
      </ThemeProvider>
    )
  },
)

const Container = styled.div`
  width: 100%;
  max-width: 148px;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;

  .eds-datepicker {
    font-family: ${tokens.entities.title.typography.fontFamily} !important;
  }
  .react-datepicker__month-container {
    width: ${tokens.width};
  }
  .react-datepicker__header {
    background-color: ${tokens.background};
    border-bottom: none;
    padding: 0;
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
  ${({ theme }) => css`
    position: relative;
    color: ${theme.entities.label.typography.color};
    font-family: ${theme.entities.label.typography.fontFamily};
    font-size: ${theme.entities.label.typography.fontSize};
    line-height: ${theme.entities.label.typography.lineHeight};

    span {
      padding-left: 8px;
      color: ${tokens.colors.iconGray};
      &:empty {
        display: none;
      }
    }
  `}
`

const StyledDatepicker = styled(DatePicker)`
  ${({ theme }) => css`
    height: 24px;
    font-family: ${theme.entities.title.typography.fontFamily};
    font-size: ${theme.entities.title.typography.fontSize};
    color: ${theme.entities.title.typography.color};
    line-height: ${theme.entities.title.typography.lineHeight};
    box-shadow: inset 0 -1px 0 0 #6f6f6f;
    background-color: ${theme.background};
    border: none;
    padding: 6px;
    width: 100%;
    max-width: 136px;
    border-radius: 0%;

    &:focus {
      border-radius: none;
      ${outlineTemplate(theme.states.focus.outline)}
    }
  `}
`

const CalendarIcon = styled(Icon)`
  position: absolute;
  z-index: 1;
  bottom: 7px;
  right: 6px;
  cursor: pointer;
`

export { ReactDatePicker as DatePicker }
