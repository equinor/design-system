import { forwardRef, InputHTMLAttributes } from 'react'
import { OverridableComponent } from '@equinor/eds-utils'
import { error_filled } from '@equinor/eds-icons'
import { Icon } from '../Icon'
import type { InputProps } from './Input.types'

export const Input: OverridableComponent<InputProps, HTMLInputElement> =
  forwardRef<HTMLInputElement, InputProps>(function Input(
    {
      invalid = false,
      disabled,
      readOnly,
      type = 'text',
      startText,
      startAdornment,
      endText,
      endAdornment,
      containerClassName,
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

    const containerClasses = ['eds-input-container', containerClassName]
      .filter(Boolean)
      .join(' ')

    return (
      <div
        className={containerClasses}
        data-color-appearance={colorAppearance}
        data-font-size="md"
        data-selectable-space="sm"
        data-space-proportions="squished"
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        data-invalid={invalid || undefined}
      >
        {showErrorIcon && (
          <span
            className="eds-error-icon"
            data-font-size="xs"
            data-font-family="ui"
            data-baseline="center"
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
                data-baseline="center"
              >
                {startText}
              </span>
            )}
            {startAdornment && (
              <span
                className="eds-adornment__adornment"
                data-font-size="xs"
                data-font-family="ui"
                data-baseline="center"
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
          className={['eds-input', className].filter(Boolean).join(' ')}
          data-color-appearance="neutral"
          data-font-family="ui"
          data-font-size="md"
          data-line-height="default"
          {...(inputProps as InputHTMLAttributes<
            HTMLInputElement | HTMLTextAreaElement
          >)}
          aria-invalid={invalid || undefined}
        />
        {hasEndAdornment && (
          <div className="eds-adornment" data-font-size="xs">
            {endText && (
              <span
                className="eds-adornment__text"
                data-color-appearance="neutral"
                data-font-family="ui"
                data-font-size="xs"
                data-baseline="center"
              >
                {endText}
              </span>
            )}
            {endAdornment && (
              <span
                className="eds-adornment__adornment"
                data-font-size="xs"
                data-font-family="ui"
                data-baseline="center"
              >
                {endAdornment}
              </span>
            )}
          </div>
        )}
      </div>
    )
  })
