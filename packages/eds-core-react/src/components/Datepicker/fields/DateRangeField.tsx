import React, { forwardRef, useRef } from 'react'
import { InputProps } from '../../Input'
import { InputFieldWrapper } from './FieldWrapper'
import { AriaDatePickerProps, DateValue } from 'react-aria'
import { SingleDateField } from './SingleDateField'
import { GroupDOMAttributes } from '@react-types/shared'

type Props = {
  startFieldProps: AriaDatePickerProps<DateValue>
  endFieldProps: AriaDatePickerProps<DateValue>
  groupProps: GroupDOMAttributes
} & Partial<InputProps>

/**
 * DateRangeField is the input field used in {@link DateRangePicker} to type in a date range.
 */
export const DateRangeField = forwardRef<HTMLDivElement, Props>(function (
  props: Props,
  ref,
) {
  const fromRef = useRef(null)
  const toRef = useRef(null)

  return (
    <InputFieldWrapper
      ref={ref}
      className="field"
      disabled={props.disabled}
      color={props.variant}
      {...props.groupProps}
    >
      <SingleDateField {...props.startFieldProps} ref={fromRef} />
      <span style={{ padding: '0 8px' }}>&mdash;</span>
      <SingleDateField {...props.endFieldProps} ref={toRef} />
      <span style={{ flex: '1 1 auto' }} />
      {props.rightAdornments}
    </InputFieldWrapper>
  )
})

DateRangeField.displayName = 'DateRangeField'
