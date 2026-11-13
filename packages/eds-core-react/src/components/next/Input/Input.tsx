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
      className,
      style,
      as: Component = 'input',
      ...inputProps
    },
    ref,
  ) {
    const tone = invalid && !disabled && !readOnly ? 'danger' : 'neutral'

    const displayErrorIcon = !hideErrorIcon && invalid && !disabled && !readOnly
    const hasStartAdornment = startText || startAdornment
    const hasEndAdornment = endText || endAdornment

    return (
      <div
        className={['eds-input', className].filter(Boolean).join(' ')}
        style={style}
        data-tone={tone}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        data-invalid={invalid || undefined}
      >
        {displayErrorIcon && (
          <span className="error-icon">
            <Icon data={error_filled} size="md" />
          </span>
        )}
        {hasStartAdornment && (
          <div className="adornment">
            {startText && <span className="text">{startText}</span>}
            {startAdornment && <span className="item">{startAdornment}</span>}
          </div>
        )}
        <Component
          ref={ref as React.Ref<HTMLInputElement & HTMLTextAreaElement>}
          type={Component === 'textarea' ? undefined : type}
          disabled={disabled}
          readOnly={readOnly}
          className="control"
          {...(inputProps as InputHTMLAttributes<
            HTMLInputElement | HTMLTextAreaElement
          >)}
          aria-invalid={invalid || undefined}
        />
        {hasEndAdornment && (
          <div className="adornment">
            {endText && <span className="text">{endText}</span>}
            {endAdornment && <span className="item">{endAdornment}</span>}
          </div>
        )}
      </div>
    )
  })
