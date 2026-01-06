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
      readOnly = false,
      type = 'text',
      leftAdornments,
      rightAdornments,
      leftAdornmentsProps,
      rightAdornmentsProps,
      leftAdornmentsWidth,
      rightAdornmentsWidth,
      className,
      style,
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
        data-color-appearance={colorAppearance}
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
          aria-invalid={invalid || undefined}
          className="eds-input"
          style={fieldStyle}
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
