/* eslint camelcase: "off" */
import { forwardRef, useId } from 'react'
import {
  radio_button_selected,
  radio_button_unselected,
} from '@equinor/eds-icons'
import { Field } from '../Field'
import { Icon } from '../Icon'
import type { RadioProps } from './Radio.types'

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, disabled = false, className, id: providedId, ...rest },
  ref,
) {
  const generatedId = useId()
  const inputId = providedId ?? generatedId

  const radioInput = (
    <>
      <input
        type="radio"
        id={inputId}
        // Merge so a consumer className can't clobber the 'input' class the
        // component CSS keys its :has(.input:...) state selectors on
        className={['input', className].filter(Boolean).join(' ')}
        disabled={disabled}
        ref={ref}
        {...rest}
      />
      <span className="icon-wrapper">
        <Icon
          data={radio_button_selected}
          size="lg"
          className="icon icon-checked"
        />
        <Icon
          data={radio_button_unselected}
          size="lg"
          className="icon icon-unchecked"
        />
      </span>
    </>
  )

  // Use Field for layout when label is provided
  if (label) {
    return (
      <Field
        position="start"
        disabled={disabled}
        className="eds-radio"
        data-color-appearance="accent"
        data-selectable-space="md"
        data-space-proportions="squished"
      >
        {radioInput}
        <Field.Label htmlFor={inputId}>{label}</Field.Label>
      </Field>
    )
  }

  return (
    <span
      className="eds-radio"
      data-standalone={true}
      data-color-appearance="accent"
    >
      {radioInput}
    </span>
  )
})

Radio.displayName = 'Radio'
