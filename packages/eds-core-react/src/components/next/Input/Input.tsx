import { forwardRef, InputHTMLAttributes } from 'react'
import { OverridableComponent } from '@equinor/eds-utils'
import { error_filled } from '@equinor/eds-icons'
import { Icon } from '../Icon'
import type { InputProps } from './Input.types'

export const Input: OverridableComponent<InputProps, HTMLInputElement> =
  forwardRef<
    HTMLInputElement,
    InputProps & InputHTMLAttributes<HTMLInputElement>
  >(function Input(
    {
      invalid = false,
      disabled,
      readOnly,
      type = 'text',
      startText,
      startAdornment,
      endText,
      endAdornment,
      className,
      as: Component = 'input',
      ...inputProps
    },
    ref,
  ) {
    const colorAppearance = invalid && !disabled ? 'danger' : 'neutral'

    const showErrorIcon = invalid && !disabled
    const hasStartAdornment = startText || startAdornment
    const hasEndAdornment = endText || endAdornment

    const containerClasses = ['eds-input-container', className]
      .filter(Boolean)
      .join(' ')

    return (
      <div
        className={containerClasses}
        data-color-appearance={colorAppearance}
        data-selectable-space="xs"
        data-space-proportions="stretched"
        data-font-size="xs"
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        data-invalid={invalid || undefined}
      >
        {showErrorIcon && (
          <span
            className="eds-error-icon"
            data-font-size="xs"
            data-font-family="ui"
          >
            <Icon data={error_filled} />
          </span>
        )}
        {hasStartAdornment && (
          <div className="eds-adornment" data-font-size="xs">
            {startText && (
              <span
                className="eds-adornment__text"
                data-color-appearance="neutral"
                data-font-family="ui"
                data-font-size="xs"
              >
                {startText}
              </span>
            )}
            {startAdornment && (
              <span
                className="eds-adornment__adornment"
                data-font-size="xs"
                data-font-family="ui"
              >
                {startAdornment}
              </span>
            )}
          </div>
        )}
        <Component
          ref={ref as React.Ref<HTMLInputElement & HTMLTextAreaElement>}
          type={type}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={invalid || undefined}
          className="eds-input"
          data-color-appearance="neutral"
          data-font-size="md"
          data-font-family="ui"
          {...(inputProps as InputHTMLAttributes<
            HTMLInputElement | HTMLTextAreaElement
          >)}
        />
        {hasEndAdornment && (
          <div className="eds-adornment" data-font-size="xs">
            {endText && (
              <span
                className="eds-adornment__text"
                data-color-appearance="neutral"
                data-font-family="ui"
                data-font-size="xs"
              >
                {endText}
              </span>
            )}
            {endAdornment && (
              <span
                className="eds-adornment__adornment"
                data-font-size="xs"
                data-font-family="ui"
              >
                {endAdornment}
              </span>
            )}
          </div>
        )}
      </div>
    )
  })
