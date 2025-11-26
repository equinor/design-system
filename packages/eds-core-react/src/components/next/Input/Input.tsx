import { forwardRef, useState, InputHTMLAttributes, CSSProperties } from 'react'
import { OverridableComponent } from '@equinor/eds-utils'
import type { InputProps } from './Input.types'

export const Input: OverridableComponent<InputProps, HTMLInputElement> =
  forwardRef<
    HTMLInputElement,
    InputProps & InputHTMLAttributes<HTMLInputElement>
  >(function Input(
    {
      invalid = false,
      disabled = false,
      type = 'text',
      leftAdornments,
      rightAdornments,
      readOnly,
      className,
      style,
      leftAdornmentsProps,
      rightAdornmentsProps,
      leftAdornmentsWidth,
      rightAdornmentsWidth,
      as: Component = 'input',
      ...inputProps
    },
    ref,
  ) {
    const [leftAdornmentsRef, setLeftAdornmentsRef] = useState<HTMLDivElement>()
    const [rightAdornmentsRef, setRightAdornmentsRef] =
      useState<HTMLDivElement>()

    // Calculate dynamic padding based on adornment widths
    // Use manual width if provided, otherwise auto-measure from DOM
    const leftWidth =
      leftAdornmentsWidth ?? (leftAdornmentsRef?.clientWidth || 0)
    const rightWidth =
      rightAdornmentsWidth ?? (rightAdornmentsRef?.clientWidth || 0)

    // Map invalid state to color appearance (internal use only)
    const colorAppearance = invalid ? 'danger' : 'neutral'

    // Fixed EDS 2.0 spacing values (internal - not exposed to users)
    const selectableSpace = 'xs'
    const spaceProportions = 'stretched'

    const containerClasses = [
      'eds-input',
      className,
      disabled && 'eds-input--disabled',
      readOnly && 'eds-input--readonly',
      invalid && 'eds-input--invalid',
    ]
      .filter(Boolean)
      .join(' ')

    // Inline styles for dynamic adornment spacing
    const fieldStyle: CSSProperties = {
      paddingLeft: leftWidth
        ? `calc(var(--eds-selectable-space-horizontal) + ${leftWidth}px)`
        : undefined,
      paddingRight: rightWidth
        ? `calc(var(--eds-selectable-space-horizontal) + ${rightWidth}px)`
        : undefined,
    }

    return (
      <div
        className={containerClasses}
        style={style}
        data-color-appearance={disabled ? 'neutral' : colorAppearance}
        data-selectable-space={selectableSpace}
        data-space-proportions={spaceProportions}
      >
        {leftAdornments && (
          <div
            {...leftAdornmentsProps}
            ref={setLeftAdornmentsRef}
            className="eds-adornment eds-adornment--left"
            data-color-appearance="neutral"
          >
            {leftAdornments}
          </div>
        )}
        <Component
          ref={ref as React.Ref<HTMLInputElement & HTMLTextAreaElement>}
          type={Component === 'input' ? type : undefined}
          disabled={disabled}
          readOnly={readOnly}
          className="eds-field"
          style={fieldStyle}
          {...(inputProps as InputHTMLAttributes<
            HTMLInputElement | HTMLTextAreaElement
          >)}
        />
        {rightAdornments && (
          <div
            {...rightAdornmentsProps}
            ref={setRightAdornmentsRef}
            className="eds-adornment eds-adornment--right"
            data-color-appearance="neutral"
          >
            {rightAdornments}
          </div>
        )}
      </div>
    )
  })
