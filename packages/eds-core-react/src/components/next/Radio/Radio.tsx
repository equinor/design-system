/* eslint camelcase: "off" */
import { forwardRef, useId } from 'react'
import {
  radio_button_selected,
  radio_button_unselected,
} from '@equinor/eds-icons'
import { Field } from '../Field'
import { Icon } from '../Icon'
import type { RadioProps } from './Radio.types'

const classNames = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(' ')

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, disabled = false, id: providedId, ...rest },
  ref,
) {
  const generatedId = useId()
  const inputId = providedId ?? generatedId

  const radioInput = (
    <>
      <input
        type="radio"
        id={inputId}
        className="eds-radio__input"
        disabled={disabled}
        ref={ref}
        {...rest}
      />
      <span className="eds-radio__icon-wrapper">
        <Icon
          data={radio_button_selected}
          size="lg"
          className="eds-radio__icon eds-radio__icon--checked"
        />
        <Icon
          data={radio_button_unselected}
          size="lg"
          className="eds-radio__icon eds-radio__icon--unchecked"
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
        data-color-appearance={disabled ? 'neutral' : 'accent'}
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
      className={classNames('eds-radio', 'eds-radio--standalone')}
      data-color-appearance={disabled ? 'neutral' : 'accent'}
      data-disabled={disabled || undefined}
    >
      {radioInput}
    </span>
  )
})

Radio.displayName = 'Radio'
