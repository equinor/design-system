import { forwardRef, useId } from 'react'
import type { TextFieldProps } from './TextField.types'
import { Field } from '../Field'
import { Input } from '../Input'
import { Label } from '../Label'
import { ValidationMessage } from '../ValidationMessage'

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      label,
      optional = false,
      required = false,
      requiredSilent = false,
      description,
      validationMessage,
      id: providedId,
      invalid = false,
      disabled = false,
      ...inputProps
    },
    ref,
  ) {
    const generatedId = useId()
    const generatedDescriptionId = useId()
    const generatedValidationId = useId()

    const id = providedId ?? generatedId
    const descriptionId = description ? generatedDescriptionId : undefined
    const validationMessageId = validationMessage
      ? generatedValidationId
      : undefined

    // Both required and requiredSilent set HTML required, but only required shows text
    const isRequired = required || requiredSilent

    // Combine IDs for aria-describedby (description first, then validation message)
    const ariaDescribedBy =
      [descriptionId, validationMessageId].filter(Boolean).join(' ') ||
      undefined

    return (
      <Field>
        {label && (
          <Label
            htmlFor={id}
            label={label}
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
        {validationMessage && (
          <ValidationMessage id={validationMessageId} disabled={disabled}>
            {validationMessage}
          </ValidationMessage>
        )}
      </Field>
    )
  },
)
