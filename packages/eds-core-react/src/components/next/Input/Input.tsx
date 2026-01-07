import { forwardRef, InputHTMLAttributes } from 'react'
import { OverridableComponent } from '@equinor/eds-utils'
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
      leftAdornments,
      rightAdornments,
      leftAdornmentsProps,
      rightAdornmentsProps,
      className,
      as: Component = 'input',
      ...inputProps
    },
    ref,
  ) {
    const colorAppearance = invalid && !disabled ? 'danger' : 'neutral'
    const selectableSpace = 'xs'
    const spaceProportions = 'stretched'

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
      >
        {leftAdornments && (
          <div
            {...leftAdornmentsProps}
            className="eds-adornment eds-adornment--left"
            data-color-appearance="neutral"
          >
            {leftAdornments}
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
          data-line-height="squished"
          {...(inputProps as InputHTMLAttributes<
            HTMLInputElement | HTMLTextAreaElement
          >)}
        />
        {rightAdornments && (
          <div
            {...rightAdornmentsProps}
            className="eds-adornment eds-adornment--right"
            data-color-appearance="neutral"
          >
            {rightAdornments}
          </div>
        )}
      </div>
    )
  })
