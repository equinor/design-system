import { forwardRef, useState, InputHTMLAttributes, CSSProperties } from 'react'
import { OverridableComponent } from '@equinor/eds-utils'
import type { InputProps } from './Input.new.types'

export const Input: OverridableComponent<InputProps, HTMLInputElement> =
  forwardRef<
    HTMLInputElement,
    InputProps & InputHTMLAttributes<HTMLInputElement>
  >(function Input(
    {
      variant,
      disabled = false,
      type = 'text',
      leftAdornments,
      rightAdornments,
      readOnly,
      className,
      style,
      leftAdornmentsProps,
      rightAdornmentsProps,
      as: Component = 'input',
      'data-testid': dataTestId,
      ...inputProps
    },
    ref,
  ) {
    const [leftAdornmentsRef, setLeftAdornmentsRef] = useState<HTMLDivElement>()
    const [rightAdornmentsRef, setRightAdornmentsRef] =
      useState<HTMLDivElement>()

    // Calculate dynamic padding based on adornment widths
    const leftWidth = leftAdornmentsRef ? leftAdornmentsRef.clientWidth : 0
    const rightWidth = rightAdornmentsRef ? rightAdornmentsRef.clientWidth : 0

    // Map variant to color appearance (internal use only)
    const colorAppearance =
      variant === 'error' ? 'danger' : variant || 'neutral'

    // Fixed EDS 2.0 spacing values (internal - not exposed to users)
    const selectableSpace = 'xs'
    const spaceProportions = 'stretched'

    const containerClasses = [
      'eds-input',
      className,
      disabled && 'eds-input--disabled',
      readOnly && 'eds-input--readonly',
      variant && `eds-input--${variant}`,
    ]
      .filter(Boolean)
      .join(' ')

    // Inline styles for dynamic adornment spacing
    const fieldStyle: CSSProperties = {
      paddingLeft: leftWidth
        ? `calc(var(--eds-selectable-spacing-inline) + ${leftWidth}px)`
        : undefined,
      paddingRight: rightWidth
        ? `calc(var(--eds-selectable-spacing-inline) + ${rightWidth}px)`
        : undefined,
    }

    return (
      <div
        className={containerClasses}
        style={style}
        data-color-appearance={colorAppearance}
        data-selectable-space={selectableSpace}
        data-space-proportions={spaceProportions}
        data-testid={dataTestId}
      >
        {leftAdornments && (
          <div
            {...leftAdornmentsProps}
            ref={setLeftAdornmentsRef}
            className="eds-adornment eds-adornment--left"
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
          >
            {rightAdornments}
          </div>
        )}
      </div>
    )
  })
