import { forwardRef, InputHTMLAttributes } from 'react'
import { OverridableComponent } from '@equinor/eds-utils'
import { error_filled } from '@equinor/eds-icons'
import { Icon } from '../Icon'
import type { InputProps } from './Input.types'

export const Input: OverridableComponent<InputProps, HTMLInputElement> =
  forwardRef<HTMLInputElement, InputProps>(function Input(
    {
      invalid = false,
      hideErrorIcon = false,
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
    const tone = invalid && !disabled && !readOnly ? 'danger' : 'neutral'

    const displayErrorIcon = !hideErrorIcon && invalid && !disabled && !readOnly
    const hasStartAdornment = startText || startAdornment
    const hasEndAdornment = endText || endAdornment

    const containerClasses = ['eds-input', containerClassName]
      .filter(Boolean)
      .join(' ')

    return (
      <div
        className={containerClasses}
        data-color-appearance={tone}
        data-font-size="md"
        data-selectable-space="sm"
        data-space-proportions="squished"
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        data-invalid={invalid || undefined}
      >
        {displayErrorIcon && (
          <span
            className="error-icon"
            data-font-size="xs"
            data-font-family="ui"
            data-baseline="center"
          >
            <Icon data={error_filled} />
          </span>
        )}
        {hasStartAdornment && (
          <div className="adornment" data-color-appearance="neutral">
            {startText && (
              <span
                className="text"
                data-font-family="ui"
                data-font-size="xs"
                data-baseline="center"
              >
                {startText}
              </span>
            )}
            {startAdornment && (
              <span className="item" data-font-size="xs">
                {startAdornment}
              </span>
            )}
          </div>
        )}
        <Component
          ref={ref as React.Ref<HTMLInputElement & HTMLTextAreaElement>}
          type={Component === 'textarea' ? undefined : type}
          disabled={disabled}
          readOnly={readOnly}
          className={['control', className].filter(Boolean).join(' ')}
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
          <div className="adornment" data-color-appearance="neutral">
            {endText && (
              <span
                className="text"
                data-font-family="ui"
                data-font-size="xs"
                data-baseline="center"
              >
                {endText}
              </span>
            )}
            {endAdornment && (
              <span className="item" data-font-size="xs">
                {endAdornment}
              </span>
            )}
          </div>
        )}
      </div>
    )
  })
