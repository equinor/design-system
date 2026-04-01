import { forwardRef } from 'react'
import { info_circle } from '@equinor/eds-icons'
import type { TextFieldProps } from './TextField.types'
import { Field, useFieldIds } from '../Field'
import { Input } from '../Input'
import { Button } from '../Button'
import { Tooltip } from '../../Tooltip'
import { Icon } from '../Icon'
import './text-field.css'

export const TextField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  TextFieldProps
>(function TextField(
  {
    label,
    labelInfo,
    indicator,
    description,
    helperMessage,
    id: providedId,
    invalid = false,
    disabled = false,
    ...inputProps
  },
  ref,
) {
  const { inputId, descriptionId, helperMessageId, getDescribedBy } =
    useFieldIds(providedId)

  return (
    <Field disabled={disabled}>
      {label && (
        <div className="eds-text-field__header">
          <Field.Label htmlFor={inputId} indicator={indicator}>
            {label}
          </Field.Label>
          {labelInfo && (
            <Tooltip title={labelInfo} placement="top">
              <Button
                variant="ghost"
                icon
                round
                size="small"
                tone="neutral"
                className="eds-text-field__info"
                aria-label="More information"
              >
                <Icon data={info_circle} size="xs" />
              </Button>
            </Tooltip>
          )}
        </div>
      )}
      {description && (
        <Field.Description id={descriptionId}>{description}</Field.Description>
      )}
      <Input
        ref={ref as React.Ref<HTMLInputElement>}
        id={inputId}
        disabled={disabled}
        invalid={invalid}
        aria-describedby={getDescribedBy({
          hasDescription: !!description,
          hasHelperMessage: !!helperMessage,
        })}
        {...inputProps}
      />
      {helperMessage && (
        <Field.HelperMessage
          id={helperMessageId}
          role={invalid ? 'alert' : undefined}
        >
          {helperMessage}
        </Field.HelperMessage>
      )}
    </Field>
  )
})
