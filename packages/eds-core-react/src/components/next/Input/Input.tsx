import { forwardRef, InputHTMLAttributes } from 'react'
import { OverridableComponent } from '@equinor/eds-utils'
import { error_filled } from '@equinor/eds-icons'
import { Icon } from '../../Icon'
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
      leftText,
      leftAdornment,
      rightText,
      rightAdornment,
      className,
      as: Component = 'input',
      ...inputProps
    },
    ref,
  ) {
    const colorAppearance = invalid && !disabled ? 'danger' : 'neutral'
    const selectableSpace = 'xs'
    const spaceProportions = 'stretched'

    const showErrorIcon = invalid && !disabled
    const hasLeftAdornment = leftText || leftAdornment
    const hasRightAdornment = rightText || rightAdornment

    const containerClasses = [
      'eds-input-container',
      className,
      disabled && 'eds-input-container--disabled',
      readOnly && 'eds-input-container--readonly',
      invalid && 'eds-input-container--invalid',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div
        className={containerClasses}
        data-color-appearance={colorAppearance}
        data-selectable-space={selectableSpace}
        data-space-proportions={spaceProportions}
        data-line-height="squished"
      >
        {showErrorIcon && (
          <span className="eds-error-icon">
            <Icon data={error_filled} size={18} />
          </span>
        )}
        {hasLeftAdornment && (
          <div className="eds-adornment">
            {leftAdornment && (
              <span className="eds-adornment__adornment">{leftAdornment}</span>
            )}
            {leftText && (
              <span
                className="eds-adornment__text"
                data-color-appearance="neutral"
                data-font-family="ui"
                data-font-size="lg"
              >
                {leftText}
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
          data-font-family="ui"
          data-font-size="lg"
          {...(inputProps as InputHTMLAttributes<
            HTMLInputElement | HTMLTextAreaElement
          >)}
        />
        {hasRightAdornment && (
          <div className="eds-adornment">
            {rightText && (
              <span
                className="eds-adornment__text"
                data-color-appearance="neutral"
                data-font-family="ui"
                data-font-size="lg"
              >
                {rightText}
              </span>
            )}
            {rightAdornment && (
              <span className="eds-adornment__adornment">{rightAdornment}</span>
            )}
          </div>
        )}
      </div>
    )
  })
