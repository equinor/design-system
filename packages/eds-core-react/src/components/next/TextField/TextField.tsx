import { forwardRef, useId } from 'react'
import type { TextFieldProps } from './TextField.types'
import { Field } from '../Field'
import { Input } from '../Input'
import { Label } from '../Label'
import { HelperMessage } from '../HelperMessage'

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      label,
      labelInfo,
      optional = false,
      required = false,
      requiredSilent = false,
      description,
      helperMessage,
      id: providedId,
      invalid = false,
      disabled = false,
      ...inputProps
    },
    ref,
  ) {
    const generatedId = useId()
    const generatedDescriptionId = useId()
    const generatedHelperMessageId = useId()

    const id = providedId ?? generatedId
    const descriptionId = description ? generatedDescriptionId : undefined
    const helperMessageId = helperMessage ? generatedHelperMessageId : undefined

    // Both required and requiredSilent set HTML required, but only required shows text
    const isRequired = required || requiredSilent

    // Combine IDs for aria-describedby (description first, then helper message)
    const ariaDescribedBy =
      [descriptionId, helperMessageId].filter(Boolean).join(' ') || undefined

    return (
      <Field>
        {label && (
          <Label
            htmlFor={id}
            label={label}
            info={labelInfo}
            optional={optional}
            required={required}
          />
        )}
        {description && (
          <Field.Description id={descriptionId}>
            {description}
          </Field.Description>
        )}
        <Input
          ref={ref}
          id={id}
          disabled={disabled}
          invalid={invalid}
          required={isRequired}
          aria-describedby={ariaDescribedBy}
          {...inputProps}
        />
        {helperMessage && (
          <HelperMessage id={helperMessageId} disabled={disabled}>
            {helperMessage}
          </HelperMessage>
        )}
      </Field>
    )
  },
)
