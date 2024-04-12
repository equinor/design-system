import { AriaDatePickerProps, DateValue } from 'react-aria'
import {
  DateFieldStateOptions,
  useDateFieldState,
} from '@react-stately/datepicker'
import { forwardRef, ReactNode, useRef } from 'react'
import { InputFieldWrapper } from './FieldWrapper'
import { SingleDateField } from './SingleDateField'
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
 * Datefield is the input field used in {@link DatePicker} to type in a single date.
 * Encapsulates styling / functionality for typing a date
 */
export const DateField = forwardRef<HTMLDivElement, Props>(function (
  { fieldProps, groupProps, variant, dateCreateProps, ...props }: Props,
  ref,
) {
  const state = useDateFieldState(dateCreateProps)
  const inputRef = useRef(null)

  return (
    <InputFieldWrapper
      {...groupProps}
      disabled={state.isDisabled}
      color={state.isInvalid ? 'warning' : variant}
      ref={ref}
      className={`field ${state.isInvalid ? 'invalid' : 'valid'}`}
    >
      <SingleDateField {...state} {...fieldProps} ref={inputRef} />
      <span style={{ flex: '1 1 auto' }} />
      {props.rightAdornments}
    </InputFieldWrapper>
  )
})

DateField.displayName = 'DateField'
