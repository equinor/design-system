/* eslint-disable @typescript-eslint/no-explicit-any */
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
  ReactDatePickerProps,
} from 'react-datepicker'
import { enGB } from 'date-fns/locale'
import styled, {
  css,
  ThemeProvider,
  StyleSheetManager,
} from 'styled-components'
import { calendar } from '@equinor/eds-icons'
import { PopupHeader } from './PopupHeader'
import { datePicker as tokens } from './DatePicker.tokens'
import { outlineTemplate } from '@equinor/eds-utils'
import { Paper, Icon, Label } from '@equinor/eds-core-react'

registerLocale('en-gb', enGB)

type ReactDatePickerComponentProps = Pick<
  ReactDatePickerProps,
  | 'className'
  | 'dateFormat'
  | 'popperPlacement'
  | 'locale'
  | 'renderCustomHeader'
  | 'minDate'
  | 'maxDate'
  | 'readOnly'
>

export type DatePickerProps = {
  id: string
  dateValue: Date | undefined | null
  label: string
  onChanged?: (date: Date | null) => void
  disableFuture?: boolean
  disableBeforeDate?: Date
  disableAfterDate?: Date
  placeholder?: string
} & InputHTMLAttributes<HTMLInputElement> &
  ReactDatePickerComponentProps

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
      disableAfterDate,
      className,
      dateFormat = 'dd.MM.yyyy',
      placeholder = 'DD.MM.YYYY',
      readOnly = false,
      popperPlacement,
      locale = 'en-gb',
      renderCustomHeader,
      minDate,
      maxDate,
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

    const localRef = useRef<DatePicker | null>(null)
    useImperativeHandle(ref, () => localRef.current)

    const customHeader =
      renderCustomHeader ||
      ((props: ReactDatePickerCustomHeaderProps) => (
        <PopupHeader {...props} changeDate={onDateValueChange} />
      ))

    const forbiddenProps = ['showPopperArrow', 'arrowProps']
    return (
      <StyleSheetManager
        shouldForwardProp={(prop) => !forbiddenProps.includes(prop)}
      >
        <ThemeProvider theme={tokens}>
          <Container className={`date-picker ${className || ''}`}>
            <Label
              label={label}
              htmlFor={id}
              className={`date-label`}
              disabled={disabled}
            />
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
              onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
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
                if (disableFuture && new Date() < date) {
                  return false
                }
                if (disableBeforeDate && date < disableBeforeDate) {
                  return false
                }
                if (disableAfterDate && date > disableAfterDate) {
                  return false
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
              minDate={minDate}
              maxDate={maxDate}
            />
            <CalendarIcon
              name="calendar"
              className="calendar-icon"
              color={
                disabled ? tokens.colors.disabledText : tokens.colors.iconGray
              }
              data={calendar}
              size={24}
            />
          </Container>
        </ThemeProvider>
      </StyleSheetManager>
    )
  },
)

const Container = styled.div`
  width: 100%;
  min-width: 128px;
  max-width: 148px;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: content-box;

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StyledDatepicker = styled(DatePicker as any)`
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
    &:disabled {
      color: var(--eds-input-color);
      cursor: not-allowed;
      box-shadow: none;
    }
  `}
`
const CalendarIcon = styled(Icon as any)`
  position: absolute;
  bottom: 7px;
  right: 6px;
  pointer-events: none;
`

export { ReactDatePicker as DatePicker }
