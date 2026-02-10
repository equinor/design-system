import { AriaDatePickerProps, DateValue } from 'react-aria'
import {
  DateFieldStateOptions,
  useDateFieldState,
} from '@react-stately/datepicker'
import { forwardRef, ReactNode, useRef, useState } from 'react'
import { InputFieldWrapper } from './FieldWrapper'
import { DateFieldSegments } from './DateFieldSegments'
import { GroupDOMAttributes } from '@react-types/shared'
import { Variants } from '../../types'
import { CalendarDate, CalendarDateTime } from '@internationalized/date'

type Props = {
  fieldProps: AriaDatePickerProps<DateValue>
  groupProps: GroupDOMAttributes
  variant: Variants
  rightAdornments?: ReactNode
  onChange: (v: DateValue | null) => void
  dateCreateProps: DateFieldStateOptions<CalendarDate | CalendarDateTime>
}

/**
 * DateField is the input field used in {@link DatePicker} to type in a single date.
 * Encapsulates styling / functionality for typing a date
 */
export const DateField = forwardRef<HTMLDivElement, Props>(function (
  { fieldProps, groupProps, variant, dateCreateProps, ...props }: Props,
  ref,
) {
  const [isFocused, setIsFocused] = useState(false)

  // During typing (focused), relax validation to allow any day value
  // This prevents blocking "30" or "31" when February is selected
  const fieldStateProps = {
    ...dateCreateProps,
    // Remove validation constraints during typing
    ...(isFocused && {
      minValue: undefined,
      maxValue: undefined,
      isDateUnavailable: undefined,
    }),
  }

  const state = useDateFieldState(fieldStateProps)
  const inputRef = useRef(null)

  return (
    <InputFieldWrapper
      {...groupProps}
      readonly={fieldProps.isReadOnly}
      disabled={state.isDisabled}
      color={state.isInvalid ? 'warning' : variant}
      ref={ref}
      className={`field ${state.isInvalid ? 'invalid' : 'valid'}`}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={() => setIsFocused(false)}
    >
      <DateFieldSegments
        {...state}
        {...fieldProps}
        locale={dateCreateProps.locale}
        ref={inputRef}
      />
      <span style={{ flex: '1 1 auto' }} />
      {props.rightAdornments}
    </InputFieldWrapper>
  )
})

DateField.displayName = 'DateField'
